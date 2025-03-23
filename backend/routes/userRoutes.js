const express = require('express');
const passport = require('passport');
const { isUserLoggedIn, signUp, logOut, ForgotPassword } = require('../controllers/UserControllers');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const frontendUrl = process.env.FRONTEND_URL;
const User = require('../models/User');
const FolderModel = require('../models/FolderModel')
const { isLoggedInUser } = require('../middleware/middlewares');


// Redirect user to Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth Callback
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${frontendUrl}/login`, // Redirect to login on failure
    }),
    (req, res) => {
        // Redirect to frontend with user session
        res.redirect(`${frontendUrl}`);
    }
);
// GitHub Authentication Route
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        successRedirect: `${frontendUrl}`,
        failureRedirect: `${frontendUrl}/login`,
    })
);

router.get('/isAuthenticated', isUserLoggedIn);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (!user) {
            return res.status(401).json({ message: info.message || "Invalid credentials" });
        }

        // Log the user in (this will create a session)
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Login failed" });
            }

            // Send a success response with user data (optional)
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});


router.post('/signup', signUp);

router.get('/logout', isLoggedInUser, logOut);

router.get('/user-data', isLoggedInUser, async (req, res) => {

    if (req.user) {
        let user = req.user;

        let folderCounts = await FolderModel.countDocuments({ userId: user._id });

        res.json({
            user: req.user,
            storageUsed: (user.storageUsed / (1024 * 1024 * 1024)).toFixed(5) + " GB",
            storageLimit: (user.storageLimit / (1024 * 1024 * 1024)).toFixed(2) + " GB",
            remainingStorage: ((user.storageLimit - user.storageUsed) / (1024 * 1024 * 1024)).toFixed(5) + " GB",
            usagePercentage: ((user.storageUsed / user.storageLimit) * 100).toFixed(5) + " %",
            Total_Folders: folderCounts,
        })
    }

})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_APP_PASSWORD,
    }
});

const otpStorage = {};

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        // Store email in session for verification
        req.session.resetEmail = email;

        // Email options
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        };

        // Send OTP via email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully!" });

    } catch (error) {
        console.error("Error processing OTP request:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});

// 🚀 Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otpString } = req.body;

        // Check if OTP exists and matches
        if (!otpStorage[email] || otpStorage[email].otp !== otpString) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Check if OTP has expired
        if (otpStorage[email].expiresAt < Date.now()) {
            delete otpStorage[email]; // Remove expired OTP
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Mark user as verified
        req.session.isOtpVerified = true;
        res.json({ message: "OTP verified successfully!" });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

// 🚀 Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Ensure user is verified before allowing password reset
        if (!req.session.isOtpVerified || req.session.resetEmail !== email) {
            return res.status(400).json({ message: "You are not verified!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Reset password using Passport-Local Mongoose's setPassword()
        await user.setPassword(newPassword);
        await user.save();

        // Clear session and OTP storage
        req.session.destroy();
        delete otpStorage[email];

        res.json({ message: "Password reset successful!" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password" });
    }
});


module.exports = router;