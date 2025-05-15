const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} = require("../controllers/authController");

const { protect, autoRefresh } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} = require("../utils/validator");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/me", protect, autoRefresh, getMe);
router.put("/profile", validateProfileUpdate, protect, updateProfile);
router.post("/logout", protect, logout);

router.post("/refresh", protect, async (req, res, next) => {
  try {
    const jwt = require("jsonwebtoken");
    const config = require("../config/config");

    const newToken = jwt.sign(
      {
        id: req.user.id,
        iat: Math.floor(Date.now() / 1000),
      },
      config.jwt.secret,
      {
        expiresIn: "30m",
      }
    );

    const { getTokenExpirationMinutes } = require("../utils/jwtUtils");
    const newTokenMinutes = getTokenExpirationMinutes(newToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          created_at: req.user.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Backend: Token refresh error:", error);
    next(error);
  }
});

router.get("/token-status", protect, async (req, res, next) => {
  try {
    const { getTokenExpirationMinutes } = require("../utils/jwtUtils");
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const minutesLeft = getTokenExpirationMinutes(token);
    const isExpired = minutesLeft <= 0;
    const isNearExpiration = minutesLeft <= 15;

    res.status(200).json({
      success: true,
      data: {
        minutesUntilExpiration: minutesLeft,
        isExpired,
        isNearExpiration,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
