const app = require("./app");
const { connectDB } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, closing server...");
      server.close(() => {
        const { pool } = require("./src/config/database");
        pool.end();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, closing server...");
      server.close(() => {
        const { pool } = require("./src/config/database");
        pool.end();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
