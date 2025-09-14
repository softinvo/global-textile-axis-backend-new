// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config({ path: "config/.env" });
// const database = require("./config/database");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const app = express();

// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5173",
// //       "https://bookmywarehouse.co",
// //       "https://dev.admin.bookmywarehouse.co",
// //       "https://admin.bookmywarehouse.co",
// //       "https://test.admin.bookmywarehouse.co",
// //       "*",
// //     ],
// //     credentials: true,
// //   })
// // );

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "*",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.raw({ limit: "10mb", type: "image/*" }));

// const PORT = process.env.PORT || 5000;
// database.connect();

// // Import and Use Routes
// require("./routes")(app);

// app.get("/", (req, res) => {
//   res.status(200).json({ msg: "Deployed Successfully" });
// });

// app.use((req, res, next) => {
//   res.status(404).json({ msg: "Something Unexpected Found" });
// });

// // Global Error Handler Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ msg: "An unexpected error occurred" });
// });

// app.listen(PORT, () => {
//   console.log(`App is running at ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });

// Import routes
const authRoutes = require("./routes/auth.routes");
const buyerProfileRoutes = require("./routes/buyer.profile.routes");
const sellerProfileRoutes = require("./routes/seller.profile.routes");
const storageRoutes = require("./routes/storage.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-production-domain.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Route prefix
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/buyer", buyerProfileRoutes);
app.use("/api/v1/seller", sellerProfileRoutes);
app.use("/api/v1/storage", storageRoutes);

// Health check
app.get("/", async (req, res) => {
  await connectDB(); // Ensure DB connection on cold start
  res.json({ msg: "Serverless API Running" });
});

// 404 handler
app.use((req, res) => res.status(404).json({ msg: "Not Found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ✅ Only listen locally for development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export for serverless
