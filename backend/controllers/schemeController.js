const Scheme = require('../models/Scheme');


const getSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find({});
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
