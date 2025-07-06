const express = require("express");
const router = express.Router();
const { getUserByEmail , verifyAccountPassword } = require("../controllers/userController");

// Route to get user by email
router.get("/by-email/:email", getUserByEmail);
router.post("/verify-password", verifyAccountPassword);
module.exports = router;
