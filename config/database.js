// const mongoose = require("mongoose");
// require("dotenv").config();

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

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

exports.connect = async () => {
  if (cached.conn) return cached.conn; // ✅ reuse existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URL, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // 10s timeout
      })
      .then((mongoose) => {
        console.log("✅ DB connected Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ DB not connected", err.message);
        throw err; // ❌ don't use process.exit in Vercel
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
