const express = require('express');
const router = express.Router();
const { createAdmin } = require('../controllers/adminManagementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/create-admin').post(protect, adminOnly, createAdmin);

module.exports = router;
