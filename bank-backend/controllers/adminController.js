const User = require('../models/User');

// Get all pending applications
exports.getPendingApplications = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: false,
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
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve application' });
  }
};

// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        videoVerificationSubmittedAt: null,
        videoVerificationImageUrls: [],
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject application' });
  }
};
