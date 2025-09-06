const express = require("express");
// Import other routes if needed
const authRoutes = require("./auth.routes");
module.exports = (app) => {
  // Use Routes
  app.use("/api/v1", authRoutes);
};
