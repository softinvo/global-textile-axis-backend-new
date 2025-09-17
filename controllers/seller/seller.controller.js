const Seller = require("../../models/seller.model");
const Address = require("../../models/address.model");
const mongoose = require("mongoose");
const { addressSchema } = require("../../schemaValidator/address.validator");
const {
  updateSellerProfileSchema,
} = require("../../schemaValidator/seller.profile.validator");

const viewProfile = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.sellerId);

    const sellerProfile = await Seller.aggregate([
      { $match: { _id: sellerId } },
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
      // No $project → return all fields
    ]);

    if (!sellerProfile || sellerProfile.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched seller profile",
      data: sellerProfile[0], // single seller object
    });
  } catch (error) {
    console.error("Error in viewProfile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit Profile
const editProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sellerId = req.sellerId;

    // ✅ validate seller fields (except address, we handle separately)
    const { address, ...sellerData } =
      await updateSellerProfileSchema.validateAsync(req.body);

    let addressId = null;

    if (address) {
      // ✅ validate address
      const validatedAddress = await addressSchema.validateAsync(address);

      const seller = await Seller.findById(sellerId).session(session);
      if (!seller) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "Seller not found" });
      }

      if (seller.address) {
        // ✅ Update existing address
        const updatedAddress = await Address.findByIdAndUpdate(
          seller.address,
          validatedAddress,
          { new: true, session }
        );
        addressId = updatedAddress._id;
      } else {
        // ✅ Create new address
        const newAddress = await Address.create([validatedAddress], {
          session,
        });
        addressId = newAddress[0]._id;
      }
    }

    // ✅ Update seller profile
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      {
        verificationStatus:"pending",
        ...sellerData,
        ...(addressId && { address: addressId }),
      },
      { new: true, session }
    ).populate("address");

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Successfully updated seller profile",
      data: updatedSeller,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  viewProfile,
  editProfile,
};
