const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../utils/validators");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
