const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "I am new here!" }, // ✅ Bio added
  categories: { type: [String], default: [] }, // ✅ Categories added
  profilePic: { type: String, default: "https://via.placeholder.com/150" }, // ✅ Profile pic added
});

module.exports = mongoose.model("User", UserSchema);
