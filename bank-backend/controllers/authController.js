const User = require("../models/User");
const generateOtp = require("../utils/generateOTP");
const transporter = require("../config/nodemailer");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  console.log("verifyOtp endpoint hit");

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid email or OTP" });

    // ✅ Don't check against already null fields
    if (
      !user.otp ||
      !user.otpExpires ||
      user.otp !== otp ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // ✅ Only update after validation
    user.isVerified = false;
    user.otp = null;
    user.otpExpires = null;

    await user.save(); // ← this must be after setting isVerified

    console.log("User marked as verified:", user.email);
    res.json({ message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};





const ADMIN_EMAIL = "bossofbank@gmail.com";
const ADMIN_PASSWORD = "12345678";

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    if (role === "admin") {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.json({ message: "Admin login successful", redirectUrl: "/admin-dashboard" });
      } else {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.accountDetails.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified yet. Please wait for admin approval." });
    }

    return res.json({ message: "User login successful", redirectUrl: "/user-dashboard" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

   const token = crypto.randomBytes(20).toString('hex');
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Reset password email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: 'Token and password are required' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    user.accountDetails.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};