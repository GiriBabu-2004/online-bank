const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user by email, exclude sensitive info
    const user = await User.findOne({ email }).select("-accountDetails.passwordHash -otp -otpExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyAccountPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });

    if (!user || !user.accountDetails?.passwordHash) {
      return res.status(404).json({ message: "User or password not found" });
    }

    const isMatch = await bcrypt.compare(password, user.accountDetails.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ message: "Password verified" });
  } catch (err) {
    console.error("Error verifying password:", err);
    res.status(500).json({ message: "Server error" });
  }
};