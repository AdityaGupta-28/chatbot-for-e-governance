
const mongoose = require('mongoose');

const schemeSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ministry: { type: String },
    eligibilityCriteria: { type: [String] },
    benefits: { type: [String] },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
