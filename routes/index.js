const express = require("express");
// Import other routes if needed
const authRoutes = require("./auth.routes");
const buyerProfileRoutes = require("./buyer.profile.routes");
const storageRoutes = require("./storage.routes");
const sellerProfileRoutes = require("./seller.profile.routes");
const adminAuthRoutes = require("./admin.authroute");
const adminBuyerRoutes = require("./admin.buyerroute");
module.exports = (app) => {
  // Use Routes
  app.use("/api/v1", authRoutes);
  app.use("/api/v1", buyerProfileRoutes);
  app.use("/api/v1", storageRoutes);
  app.use("/api/v1", sellerProfileRoutes);
  app.use("/api/v1", adminAuthRoutes);
  app.use("/api/v1", adminBuyerRoutes);
};
