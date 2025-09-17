const Seller = require("../../models/seller.model");

const getSellers = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      profileStatus,
      businessType,
      startDate,
      endDate,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const match = {};

    // Filtering
    if (profileStatus) match.profileStatus = profileStatus;
    if (businessType) match.businessType = businessType;

    // Date range filter
    if (startDate || endDate) {
      match.businessRegistrationDate = {};
      if (startDate) match.businessRegistrationDate.$gte = new Date(startDate);
      if (endDate) match.businessRegistrationDate.$lte = new Date(endDate);
    }

    // Search
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
      ];
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "addresses", // matches Address collection
          localField: "address",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          avatar: 1,
          profileStatus: 1,
          verificationStatus: 1,
          businessName: 1,
          businessType: 1,
          businessRegistrationDate: 1,
          accountHolderName: 1,
          bankName: 1,
          bankAccountNumber: 1,
          ifscCode: 1,
          created_at: 1,
          addressDetails: 1,
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [sellers, totalCount] = await Promise.all([
      Seller.aggregate(pipeline),
      Seller.countDocuments(match),
    ]);

    res.status(200).json({
      success: true,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      sellers,
    });
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get seller by ID
const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate("address");
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update seller profile Status
const updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete seller
const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    return res
      .status(200)
      .json({ success: true, message: "Seller deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
};
