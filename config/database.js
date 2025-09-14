// const mongoose = require("mongoose");

// exports.connect = () => {
//   mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(() => {
//       console.log("DB connected Successfully");
//     })
//     .catch((err) => {
//       console.log("DB not connected");
//       console.error(err);
//       // process.exit(1);
//     });
// };

const mongoose = require("mongoose");
require("dotenv").config();

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URL, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongoose) => {
        console.log("✅ DB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ DB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
