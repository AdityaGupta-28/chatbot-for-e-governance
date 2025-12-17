
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadhaar: { type: String, unique: true, sparse: true },
    phone: { type: String },
    role: { type: String, default: 'citizen' }, // citizen, admin
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) { // Keep next for compatibility but handle it properly or remove it. 
    // Actually removing next is safer for async.
    // Let's use the pattern:
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
