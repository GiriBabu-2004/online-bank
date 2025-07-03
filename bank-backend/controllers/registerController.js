const User = require("../models/User");
const bcrypt = require("bcryptjs");
const uploadToS3 = require("../config/awsS3");
const transporter = require("../config/nodemailer");

exports.savePersonalDetails = async (req, res) => {
  try {
    const {
      email,
      firstName,
      middleName,
      lastName,
      phone,
      dob,
      address,
      state,
      country,
      city,
      pincode,
      policeStation,
      postOffice,
      govIdType,
      govIdNumber,
      termsAccepted,
    } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Upload govIdFront and govIdBack to S3 if files present
    const govIdFrontFile = req.files?.govIdFront?.[0];
    const govIdBackFile = req.files?.govIdBack?.[0];

    let govIdFrontUrl = null;
    let govIdBackUrl = null;

    if (govIdFrontFile) {
      const frontUpload = await uploadToS3(
        govIdFrontFile.buffer,
        `govIdFront_${email}_${Date.now()}`,
        govIdFrontFile.mimetype
      );
      govIdFrontUrl = frontUpload.Location;
    }
    if (govIdBackFile) {
      const backUpload = await uploadToS3(
        govIdBackFile.buffer,
        `govIdBack_${email}_${Date.now()}`,
        govIdBackFile.mimetype
      );
      govIdBackUrl = backUpload.Location;
    }

    user.personalDetails = {
      firstName,
      middleName,
      lastName,
      phone,
      dob: dob ? new Date(dob) : null,
      address,
      state,
      country,
      city,
      pincode,
      policeStation,
      postOffice,
      govIdType,
      govIdNumber,
      govIdFrontUrl,
      govIdBackUrl,
      termsAccepted: termsAccepted === "true" || termsAccepted === true,
    };

    await user.save();
    res.json({ message: "Personal details saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.saveAccountDetails = async (req, res) => {
  try {
    const {
      email,
      accountType,
      nomineeName,
      nomineeRelation,
      nomineeAddress,
      nomineePhone,
      nomineeEmail,
      password,
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordHash = await bcrypt.hash(password, 10);

    user.accountDetails = {
      accountType,
      nomineeName,
      nomineeRelation,
      nomineeAddress,
      nomineePhone,
      nomineeEmail,
      passwordHash,
    };

    await user.save();
    res.json({ message: "Account details saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveVideoVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // videoImage file
    const videoImageFile = req.file;
    let videoVerificationImageUrl = null;

    if (videoImageFile) {
      const videoUpload = await uploadToS3(videoImageFile.buffer, `videoVerification_${email}_${Date.now()}`, videoImageFile.mimetype);
      videoVerificationImageUrl = videoUpload.Location;
    }

    user.videoVerificationImageUrl = videoVerificationImageUrl;
    user.videoVerificationSubmittedAt = new Date();

    await user.save();

    // Send email notification for new application
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL, // your verification team email
      subject: "New Account Verification Application",
      text: `A new application has been submitted by ${email} and is under verification.`,
    });

    res.json({ message: "Video verification data saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
