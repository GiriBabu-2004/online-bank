const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  savePersonalDetails,
  saveAccountDetails,
  saveVideoVerification,
} = require("../controllers/registerController");

// Personal details with 2 files
router.post("/personal-details", upload.fields([
  { name: "govIdFront", maxCount: 1 },
  { name: "govIdBack", maxCount: 1 },
]), savePersonalDetails);

// Account details
router.post("/account-details", express.json(), saveAccountDetails);

// ✅ Updated: Video verification – allow 5 snapshots
router.post(
  "/video-verification",
  upload.fields([
    { name: "videoImage1", maxCount: 1 },
    { name: "videoImage2", maxCount: 1 },
    { name: "videoImage3", maxCount: 1 },
    { name: "videoImage4", maxCount: 1 },
    { name: "videoImage5", maxCount: 1 },
  ]),
  saveVideoVerification
);

module.exports = router;
