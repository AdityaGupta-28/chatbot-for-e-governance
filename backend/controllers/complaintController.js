const Complaint = require('../models/Complaint');

// @desc Create complaint
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        const complaint = await Complaint.create({
            userId: req.user._id,
            title,
            description,
            category,
            priority
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error("Complaint creation error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Get complaints
const getComplaints = async (req, res) => {
    try {
        let complaints;
        if (req.user.role === 'admin') {
            complaints = await Complaint.find({})
                .populate('userId', 'name email')
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 });
        } else {
            complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update complaint
const updateComplaint = async (req, res) => {
    try {
        const { status, assignedTo, resolution, priority } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (status) complaint.status = status;
        if (assignedTo) complaint.assignedTo = assignedTo;
        if (resolution) complaint.resolution = resolution;
        if (priority) complaint.priority = priority;

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete complaint
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        await complaint.remove();
        res.json({ message: "Complaint removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, updateComplaint, deleteComplaint };
