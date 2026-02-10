const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const accessRoutes = require("./routes/accessRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const verifyRoutes = require("./routes/verifyRoutes");

const app = express();

// Simple request logger for debugging deployed route issues
app.use((req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
});

// Allow configuring the frontend origin via env (set CORS_ORIGIN on Render)
const allowedOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use("/uploads", express.static("uploads"));

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/verify", verifyRoutes);

app.get("/", (req, res) => res.json({ message: "Life-Tag backend: healthy ✅" }));

module.exports = app;
