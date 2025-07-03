const User = require("../models/User");
const generateOtp = require("../utils/generateOTP");
const transporter = require("../config/nodemailer");

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
    user.isVerified = true;
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




