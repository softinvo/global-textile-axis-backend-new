const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });
const database = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://bookmywarehouse.co",
//       "https://dev.admin.bookmywarehouse.co",
//       "https://admin.bookmywarehouse.co",
//       "https://test.admin.bookmywarehouse.co",
//       "*",
//     ],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://global-textile-axis-frontend-git-dev-softinvos-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ limit: "10mb", type: "image/*" }));

const PORT = process.env.PORT || 5000;
database.connect();

// Import and Use Routes
require("./routes")(app);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Deployed Successfully" });
});

app.use((req, res, next) => {
  res.status(404).json({ msg: "Something Unexpected Found" });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "An unexpected error occurred" });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
