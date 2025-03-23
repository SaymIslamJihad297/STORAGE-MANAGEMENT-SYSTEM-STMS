module.exports.isLoggedInUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.json({ message: "Login First" });
    } else {
        next();
    }
}