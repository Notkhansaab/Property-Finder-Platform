const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

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

module.exports = router;
