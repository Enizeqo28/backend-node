// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// POST route for logging in a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // For production, you should hash and compare passwords.
    // Here we compare directly for simplicity.
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Other routes (profile, update, create, etc.)...
// GET profile route (Protected)
router.get("/profile", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update profile (Protected)
router.put("/profile/update", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const { bio, categories, profilePic } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { bio, categories, profilePic },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST route for creating a new user (Signup)
router.post("/create", async (req, res) => {
  try {
    const { fullName, email, age, password } = req.body;

    if (!fullName || !email || !age || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      fullName,
      email,
      age,
      password,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in signup route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
