module.exports = {
  jwt: {
    secret:
      process.env.JWT_SECRET || "your-default-secret-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRE || "30m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  },

  password: {
    saltRounds: 10,
  },

  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || "development",
  },

  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },

  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  },

  tokenWarnings: {
    criticalThreshold: 5,
    warningThreshold: 15,
    refreshThreshold: 30,
  },
};
