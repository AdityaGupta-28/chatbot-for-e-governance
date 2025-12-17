const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .put(protect, adminOnly, updateComplaint)
    .delete(protect, adminOnly, deleteComplaint);

module.exports = router;
