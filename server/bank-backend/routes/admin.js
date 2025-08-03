const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Import the User model

const {
  getPendingApplications,
  approveApplication,
  rejectApplication
} = require('../controllers/adminController');

// Get all pending applications
router.get('/pending-applications', getPendingApplications);

// Approve / Reject application
router.patch('/pending-applications/:id/approve', approveApplication);
router.patch('/pending-applications/:id/reject', rejectApplication);

// ✅ Get single pending application by ID
router.get('/pending-applications/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isVerified !== false) {
      return res.status(404).json({ message: 'Pending application not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

module.exports = router;
