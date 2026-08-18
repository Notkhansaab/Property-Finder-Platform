const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT id, full_name, email, role
      FROM users
      WHERE id = $1;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        isHost: user.role === "host",
      },
    });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/auth/me):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/api/auth/logout", async (req, res) => {
  try {
    const clearOptions = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("token", clearOptions);
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

router.patch("/api/users/toggle-host-mode", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const query = `
      UPDATE users
      SET role = CASE WHEN role = 'host' THEN 'user' ELSE 'host' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, role;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedRole = result.rows[0].role;

    res.json({ success: true, isHost: updatedRole === "host" });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/users/toggle-host-mode):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const query = `
      SELECT id, title, message AS desc, created_at AS time
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
    `;

    const result = await pool.query(query, [userId]);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/notifications):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (full_name, email, password_hash, phone, role, status)
      VALUES ($1, $2, $3, $4, 'user', 'active')
      RETURNING id, full_name, email, role, status, created_at;
    `;

    const values = [
      fullName.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      phone || null,
    ];
    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/auth/register):", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const query = `
      SELECT id, full_name, email, password_hash, role, status
      FROM users
      WHERE email = $1;
    `;

    const result = await pool.query(query, [email.trim().toLowerCase()]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const user = result.rows[0];

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive or suspended.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/auth/login):", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
});

module.exports = router;
