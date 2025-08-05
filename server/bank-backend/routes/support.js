const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { submitSupport } = require('../controllers/supportController');

// Apply fileUpload ONLY for this route
router.post('/', fileUpload(), submitSupport);

module.exports = router;
