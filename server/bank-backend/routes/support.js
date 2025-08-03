const express = require('express');
const router = express.Router();
const { submitSupport } = require('../controllers/supportController');

router.post('/', submitSupport);

module.exports = router;
