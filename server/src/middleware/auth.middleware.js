const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user.model");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
        data: {},
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.userId).select("_id name email");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: invalid token",
        data: {},
      });
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
      data: {},
    });
  }
}

module.exports = authMiddleware;