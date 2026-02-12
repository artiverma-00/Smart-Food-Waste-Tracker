const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

function sanitizeUser(userDoc) {
  return {
    id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    createdAt: userDoc.createdAt,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
        data: {},
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ userId: user._id.toString() });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: {},
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: {},
      });
    }

    const token = generateToken({ userId: user._id.toString() });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;

    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.user.userId } });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
          data: {},
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { ...(name && { name }), ...(email && { email }) } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};