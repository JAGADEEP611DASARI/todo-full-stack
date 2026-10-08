const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "To-Do REST API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo_app")
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
