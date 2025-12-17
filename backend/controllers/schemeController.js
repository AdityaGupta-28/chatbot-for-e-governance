const Scheme = require('../models/Scheme');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find({});
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (scheme) {
            res.json(scheme);
        } else {
            res.status(404).json({ message: 'Scheme not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a scheme
// @route   POST /api/schemes
// @access  Private/Admin
const createScheme = async (req, res) => {
    try {
        const { name, description, ministry, eligibilityCriteria, benefits, link } = req.body;

        const scheme = new Scheme({
            name,
            description,
            ministry,
            eligibilityCriteria,
            benefits,
            link
        });

        const createdScheme = await scheme.save();
        res.status(201).json(createdScheme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a scheme
// @route   PUT /api/schemes/:id
// @access  Private/Admin
const updateScheme = async (req, res) => {
    try {
        const { name, description, ministry, eligibilityCriteria, benefits, link } = req.body;

        const scheme = await Scheme.findById(req.params.id);

        if (scheme) {
            scheme.name = name || scheme.name;
            scheme.description = description || scheme.description;
            scheme.ministry = ministry || scheme.ministry;
            scheme.eligibilityCriteria = eligibilityCriteria || scheme.eligibilityCriteria;
            scheme.benefits = benefits || scheme.benefits;
            scheme.link = link || scheme.link;

            const updatedScheme = await scheme.save();
            res.json(updatedScheme);
        } else {
            res.status(404).json({ message: 'Scheme not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a scheme
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
const deleteScheme = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);

        if (scheme) {
            await scheme.deleteOne();
            res.json({ message: 'Scheme removed' });
        } else {
            res.status(404).json({ message: 'Scheme not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    deleteScheme
};
