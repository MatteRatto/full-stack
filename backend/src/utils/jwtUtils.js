const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw error;
  }
};

const getTokenPayload = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

const getTokenExpirationMinutes = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return 0;

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    return Math.max(0, Math.floor(timeUntilExpiration / (1000 * 60)));
  } catch (error) {
    return 0;
  }
};

const isTokenNearExpiration = (token, minutesThreshold = 15) => {
  try {
    const minutesLeft = getTokenExpirationMinutes(token);
    return minutesLeft <= minutesThreshold && minutesLeft > 0;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenPayload,
  getTokenExpirationMinutes,
  isTokenNearExpiration,
};
