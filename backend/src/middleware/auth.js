const User = require("../models/User");
const config = require("../config/config");
const { verifyToken, isTokenNearExpiration } = require("../utils/jwtUtils");

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
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token non valido. Utente non trovato.",
      });
    }

    req.user = user;

    req.tokenInfo = {
      isNearExpiration: isTokenNearExpiration(token),
      payload: decoded,
    };

    if (req.tokenInfo.isNearExpiration) {
      res.set("X-Token-Warning", "Token is near expiration");
    }

    next();
  } catch (error) {
    let errorMessage = "Token non valido";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token scaduto";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Token malformato";
    }

    return res.status(401).json({
      success: false,
      message: errorMessage,
      error: error.name,
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Accesso negato. Ruolo non definito.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accesso negato. Non hai i permessi necessari.",
      });
    }
    next();
  };
};

exports.autoRefresh = async (req, res, next) => {
  if (req.tokenInfo && req.tokenInfo.isNearExpiration && req.user) {
    try {
      const { generateToken } = require("../utils/jwtUtils");
      const newToken = generateToken(req.user.id);

      res.set("X-New-Token", newToken);
      res.set("X-Token-Refreshed", "true");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }
  next();
};
