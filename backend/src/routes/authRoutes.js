const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} = require("../utils/validator");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/me", protect, getMe);
router.put("/profile", protect, validateProfileUpdate, updateProfile);
router.post("/logout", protect, logout);

module.exports = router;
