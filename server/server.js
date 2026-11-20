import dns from "dns";
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
  }
};
startServer();
