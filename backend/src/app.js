const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const userRoutes = require("./routes/userRoutes");
const hostRoutes = require("./routes/hostRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(testRoutes);
app.use(adminRoutes);
app.use(propertyRoutes);
app.use(authRoutes);
app.use(conversationRoutes);
app.use(userRoutes);
app.use(hostRoutes);
app.use(wishlistRoutes);

module.exports = app;
