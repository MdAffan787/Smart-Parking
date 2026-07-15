const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports.isAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "You have to login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        req.userId = user._id; // Optional (for convenience)

        next();

    } catch (err) {

        return res.status(401).json({
            message: err.message
        });

    }
};