const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Estate Link API is running 🚀",
  });
});

router.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.json({
      success: true,
      message: "Database is working",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection/query failed",
      error: error.message,
    });
  }
});

module.exports = router;
