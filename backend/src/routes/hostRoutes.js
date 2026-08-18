const express = require("express");
const pool = require("../config/db");
const { authenticateToken, verifyToken } = require("../middleware/auth");
const { upload, uploadAvatar } = require("../config/upload");

const router = express.Router();

router.get("/api/host/listings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const hpRes = await pool.query(
      `SELECT id FROM host_profiles WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    const hostProfileId = hpRes.rows[0]?.id || null;

    const query = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.property_type AS category,
        p.listing_type AS type,
        COALESCE(CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state, ''), NULLIF(p.country, '')), p.address, '') AS location,
        p.beds,
        p.bedrooms,
        p.baths AS baths,
        p.guests,
        p.price,
        p.price_period AS period,
        p.main_image_url AS image,
        p.status,
        p.created_at
      FROM properties p
      WHERE (p.host_id = $1 OR p.host_id = $2)
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(query, [userId, hostProfileId]);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error("GET HOST LISTINGS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/api/host/bookings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const hpRes = await pool.query(
      `SELECT id FROM host_profiles WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    const hostProfileId = hpRes.rows[0]?.id || null;

    const query = `
      SELECT
        b.id,
        b.property_id,
        b.user_id,
        b.check_in,
        b.check_out,
        b.guests,
        b.status,
        b.total_amount,
        p.title AS property_title,
        p.main_image_url AS property_image,
        COALESCE(CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state, ''), NULLIF(p.country, '')), p.address, '') AS property_location,
        u.full_name AS guest_name,
        u.email AS guest_email,
        b.created_at
      FROM bookings b
      JOIN properties p ON p.id = b.property_id
      LEFT JOIN users u ON u.id = b.user_id
      WHERE (p.host_id = $1 OR p.host_id = $2)
      ORDER BY b.check_in DESC;
    `;

    const result = await pool.query(query, [userId, hostProfileId]);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error("GET HOST BOOKINGS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/api/host/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalPropertiesQuery = `SELECT COUNT(*) FROM properties WHERE host_id = $1;`;
    const bookingsQuery = `SELECT COUNT(*) FROM bookings b JOIN properties p ON p.id = b.property_id WHERE p.host_id = $1;`;
    const earningsQuery = `SELECT COALESCE(SUM(total_amount), 0) FROM bookings b JOIN properties p ON p.id = b.property_id WHERE p.host_id = $1;`;

    const [properties, bookings, earnings] = await Promise.all([
      pool.query(totalPropertiesQuery, [userId]),
      pool.query(bookingsQuery, [userId]),
      pool.query(earningsQuery, [userId]),
    ]);

    res.json({
      success: true,
      data: {
        totalProperties: Number(properties.rows[0].count),
        totalBookings: Number(bookings.rows[0].count),
        totalEarnings: Number(earnings.rows[0].coalesce),
      },
    });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/host/dashboard):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/api/host/verification",
  verifyToken,
  upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const files = req.files || {};

      res.json({
        success: true,
        message: "Verification submitted successfully.",
        data: {
          userId,
          documentFront: files.documentFront?.[0]?.filename || null,
          documentBack: files.documentBack?.[0]?.filename || null,
          selfieImage: files.selfieImage?.[0]?.filename || null,
        },
      });
    } catch (error) {
      console.error("POST /api/host/verification ERROR:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

router.get("/api/host/verification/status", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM host_verifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1;`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("GET /api/host/verification/status ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
