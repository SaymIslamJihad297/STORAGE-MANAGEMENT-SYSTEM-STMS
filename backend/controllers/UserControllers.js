const User = require('../models/User');

module.exports.isUserLoggedIn = (req, res) => {
    res.send(req.isAuthenticated());
}


module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });

        console.log(newUser, password);

        let registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            res.send("success");
        });
    } catch (error) {
        next(error);
    }
};


module.exports.logOut = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        } else {
            res.send("Done");
        }
    })
}

module.exports.ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // check if the user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Password Reset Otp',
            text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        }

        await transporter.sendMail(mailOptions);

        res.send({ message: "Otp Sent Successfully!" });
    } catch (error) {
        res.send({ message: "Error Sending Otp" })
    }
}