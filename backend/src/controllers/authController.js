const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un utente con questa email esiste già",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Registrazione completata con successo",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Per favore fornisci email e password",
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenziali non valide",
      });
    }

    const isPasswordCorrect = await User.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Credenziali non valide",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login effettuato con successo",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    const newToken = generateToken(user.id);
    console.log("Refreshed token for user:", user.id);

    res.status(200).json({
      success: true,
      message: "Token aggiornato con successo",
      data: {
        token: newToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get token status
// @route   GET /api/auth/token-status
// @access  Private
const getTokenStatus = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token non fornito",
      });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({
        success: false,
        message: "Token non valido",
      });
    }

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    const minutesUntilExpiration = Math.floor(
      timeUntilExpiration / (1000 * 60)
    );

    const isExpired = minutesUntilExpiration <= 0;
    const isNearExpiration = minutesUntilExpiration <= 15;

    res.status(200).json({
      success: true,
      data: {
        minutesUntilExpiration: Math.max(0, minutesUntilExpiration),
        isExpired,
        isNearExpiration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const currentUser = await User.findByEmail(req.user.email);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    if (email && email !== currentUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Un utente con questa email esiste già",
        });
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Password attuale richiesta per cambiarla",
        });
      }

      const isPasswordCorrect = await User.comparePassword(
        currentPassword,
        currentUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Password attuale non corretta",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = newPassword;

    const updatedUser = await User.update(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profilo aggiornato con successo",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          created_at: updatedUser.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout effettuato con successo",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  getTokenStatus,
  updateProfile,
  logout,
};
