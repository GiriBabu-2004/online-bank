const User = require('../models/User');

// Get all pending applications
exports.getPendingApplications = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: false,
      isRejected: { $ne: true },
      videoVerificationSubmittedAt: { $exists: true }
    }).select('email personalDetails videoVerificationImageUrls videoVerificationSubmittedAt');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending applications' });
  }
};

// Approve application
exports.approveApplication = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate unique 12-digit account number
    let accountNumber;
    let isUnique = false;
    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const existing = await User.findOne({ accountNumber });
      if (!existing) isUnique = true;
    }

    user.isVerified = true;
    user.accountNumber = accountNumber;
    user.isRejected = false;

    await user.save();

    res.json({ message: 'User approved', accountNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve application' });
  }
};

// Helper function to generate random 12-digit number
function generateAccountNumber() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        videoVerificationSubmittedAt: null,
        videoVerificationImageUrls: [],
        isRejected: true,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject application' });
  }
};
