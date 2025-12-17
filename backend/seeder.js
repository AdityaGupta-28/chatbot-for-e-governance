const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('./models/Scheme');
const User = require('./models/User');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const schemes = [
    {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        description: "Financial benefit of Rs. 6000/- per year to eligible farmer families.",
        ministry: "Ministry of Agriculture",
        eligibilityCriteria: ["Small and Marginal Farmers", "Indian Citizen"],
        benefits: ["Rs. 6000 per year"],
        link: "https://pmkisan.gov.in/"
    },
    {
        name: "Aadhaar Card Update",
        description: "Update your demographic details or biometrics in Aadhaar.",
        ministry: "UIDAI",
        eligibilityCriteria: ["Indian Resident"],
        benefits: ["Identity Proof", "Address Proof"],
        link: "https://uidai.gov.in/"
    },
    {
        name: "PAN Card Application",
        description: "Apply for a new Permanent Account Number (PAN) card.",
        ministry: "Income Tax Department",
        eligibilityCriteria: ["Indian Citizen", "Taxpayer"],
        benefits: ["Financial Transactions", "Identity Proof"],
        link: "https://www.onlineservices.nsdl.com/"
    },
    {
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        description: "Housing for all scheme to provide affordable housing to the urban poor.",
        ministry: "Ministry of Housing and Urban Affairs",
        eligibilityCriteria: ["EWS", "LIG", "MIG"],
        benefits: ["Subsidy on Home Loan", "Affordable Housing"],
        link: "https://pmaymis.gov.in/"
    },
    {
        name: "Ayushman Bharat",
        description: "Health insurance scheme providing cover of Rs. 5 lakhs per family per year.",
        ministry: "Ministry of Health and Family Welfare",
        eligibilityCriteria: ["Deprived families as per SECC 2011"],
        benefits: ["Cashless treatment", "Rs. 5L Health Cover"],
        link: "https://pmjay.gov.in/"
    },
    {
        name: "DigiLocker",
        description: "Digital wallet to store and share authentic digital documents.",
        ministry: "MeitY",
        eligibilityCriteria: ["Aadhaar Holder"],
        benefits: ["Paperless documents", "Secure access"],
        link: "https://www.digilocker.gov.in/"
    }
];

const users = [
    {
        name: "Aditya Gupta",
        email: "aditya@gmail.com",
        password: "password123",
        role: "citizen",
        aadhaar: "123456789012"
    }
];

const admins = [
    {
        name: "Admin User",
        email: "admin@gmail.com",
        password: "adminpassword",
        role: "admin",
        department: "General"
    }
];

const importData = async () => {
    try {
        await Scheme.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();

        await Scheme.insertMany(schemes);

        // Use create to trigger pre-save middleware for password hashing
        for (const user of users) {
            await User.create(user);
        }

        for (const admin of admins) {
            await Admin.create(admin);
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
