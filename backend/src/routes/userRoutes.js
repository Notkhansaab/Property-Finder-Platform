const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/api/user/bookings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT
        b.id,
        b.property_id,
        b.check_in,
        b.check_out,
        b.guests,
        b.status,
        b.total_amount,
        p.title AS property_title,
        p.main_image_url AS property_image,
        COALESCE(CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state, ''), NULLIF(p.country, '')), p.address, '') AS property_location,
        u.full_name AS host_name
      FROM bookings b
      JOIN properties p ON p.id = b.property_id
      LEFT JOIN users u ON u.id = p.host_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/user/bookings):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/user/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        w.id AS wishlist_id,
        p.id AS id,
        p.title,
        p.description,
        p.property_type AS category,
        p.listing_type AS type,
        p.address,
        p.city,
        p.state,
        p.country,
        p.latitude,
        p.longitude,
        p.beds,
        p.bedrooms,
        p.baths,
        p.guests,
        p.price,
        p.currency,
        p.price_period,
        p.status,
        p.verified,
        p.main_image_url AS image,
        COALESCE(
          CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state, ''), NULLIF(p.country, '')),
          p.address,
          'Unknown Location'
        ) AS location,
        w.created_at AS saved_at
      FROM wishlists w
      INNER JOIN properties p ON p.id = w.property_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/user/wishlist):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/api/user/wishlist", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { property_id } = req.body;

    if (!property_id) {
      return res
        .status(400)
        .json({ success: false, message: "property_id is required." });
    }

    const prop = await pool.query(`SELECT id FROM properties WHERE id = $1`, [
      property_id,
    ]);
    if (prop.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    const insertQuery = `
      INSERT INTO wishlists (user_id, property_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, property_id) DO NOTHING
      RETURNING id, user_id, property_id, created_at;
    `;

    const result = await pool.query(insertQuery, [userId, property_id]);

    if (result.rows.length === 0) {
      return res.json({ success: true, message: "Already saved." });
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ ERROR (/api/user/wishlist POST):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete(
  "/api/user/wishlist/:propertyId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const propertyId = req.params.propertyId;

      const del = await pool.query(
        `DELETE FROM wishlists WHERE user_id = $1 AND property_id = $2 RETURNING id;`,
        [userId, propertyId],
      );

      if (del.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Not found in wishlist." });
      }

      res.json({ success: true, message: "Removed from wishlist." });
    } catch (error) {
      console.error("❌ ERROR (/api/user/wishlist DELETE):", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

router.patch("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email, phone } = req.body;

    const query = `
      UPDATE users
      SET full_name = COALESCE($2, full_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, full_name, email, phone;
    `;

    const result = await pool.query(query, [userId, full_name, email, phone]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/user/profile):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/api/user/avatar", authenticateToken, async (req, res) => {
  try {
    res.json({ success: true, message: "Avatar upload route placeholder" });
  } catch (error) {
    console.error("❌ ERROR (/api/user/avatar):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/api/user/change-password",
  authenticateToken,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      res.json({ success: true, message: "Password update route placeholder" });
    } catch (error) {
      console.error("❌ ERROR (/api/user/change-password):", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

module.exports = router;
