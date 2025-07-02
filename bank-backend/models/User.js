const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String }, // store latest OTP for verification
  otpExpires: { type: Date },

  personalDetails: {
    firstName: String,
    middleName: String,
    lastName: String,
    phone: String,
    dob: Date,
    address: String,
    state: String,
    country: String,
    city: String,
    pincode: String,
    policeStation: String,
    postOffice: String,
    govIdType: String,
    govIdNumber: String,
    govIdFrontUrl: String,
    govIdBackUrl: String,
    termsAccepted: Boolean,
  },

  accountDetails: {
    accountType: String,
    nomineeName: String,
    nomineeRelation: String,
    nomineeAddress: String,
    nomineePhone: String,
    nomineeEmail: String,
    passwordHash: String, // hashed password, don't store plaintext
  },

  videoVerificationImageUrl: String,
  videoVerificationSubmittedAt: Date,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
