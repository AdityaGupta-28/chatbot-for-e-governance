const express = require('express');
const router = express.Router();
const {
    getSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    deleteScheme
} = require('../controllers/schemeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSchemes)
    .post(protect, adminOnly, createScheme);

router.route('/:id')
    .get(getSchemeById)
    .put(protect, adminOnly, updateScheme)
    .delete(protect, adminOnly, deleteScheme);

module.exports = router;
