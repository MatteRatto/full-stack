const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Accesso negato. Nessun token fornito.",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token non valido",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accesso negato. Non hai i permessi necessari.",
      });
    }
    next();
  };
};
