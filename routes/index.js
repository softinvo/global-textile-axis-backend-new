const express = require("express");
// Import other routes if needed
const authRoutes = require("./auth.routes");
const buyerProfileRoutes = require("./buyer.profile.routes");
const storageRoutes = require("./storage.routes");
module.exports = (app) => {
  // Use Routes
  app.use("/api/v1", authRoutes);
  app.use("/api/v1", buyerProfileRoutes);
  app.use("/api/v1", storageRoutes);
};
