const mongoose = require("mongoose");
const Buyer = require("../../models/buyer.model");

const getBuyers = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      gender,
      profileStatus,
      startDate,
      endDate,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Build match conditions
    const matchStage = {};

    // 🔍 Search
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Filters
    if (gender) matchStage.gender = gender;
    if (profileStatus) matchStage.profileStatus = profileStatus;

    // 📅 Date filter
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "addresses", // collection name of Address model
          localField: "addresses",
          foreignField: "_id",
          as: "addresses",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Buyer.aggregate(pipeline);

    const buyers = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      buyers,
    });
  } catch (error) {
    console.error("❌ Aggregation error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getBuyers,
};
