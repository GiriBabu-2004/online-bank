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

// Video verification image (single file)
router.post("/video-verification", upload.single("videoImage"), saveVideoVerification);

module.exports = router;
