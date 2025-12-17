const User = require('../models/User');

// @desc    Create a new admin user
// @route   POST /api/admin/create-admin
// @access  Private/Admin
const createAdmin = async (req, res) => {
    try {
        // Enforce that only existing admins can create new admins (already handled by middleware, but good to double check or enforce logic here if needed)
        // Middleware protect & admin should be used on route.

        const { name, email, password } = req.body;

        console.log("Creating new admin:", { name, email });

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Admin creation failed: User already exists", email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'admin' // Force role to admin
        });

        if (user) {
            console.log("Admin created successfully:", user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            console.log("Admin creation failed: Invalid user data");
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAdmin };
