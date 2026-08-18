const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/api/admin/hosts", async (req, res) => {
  try {
    const query = `
      SELECT
        hp.id,
        u.full_name AS name,
        u.avatar_url AS avatar,
        hp.joined_at AS joined_at,
        hp.status,
        hp.phone,
        hp.company_name,
        hp.location,
        hp.verification_status,
        hp.is_active,
        hp.total_listings,
        hp.total_bookings,
        hp.total_earnings
      FROM host_profiles hp
      LEFT JOIN users u ON u.id = hp.user_id
      ORDER BY hp.joined_at DESC;
    `;

    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET /api/admin/hosts ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/hosts/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_hosts,
        COUNT(*) FILTER (WHERE status = 'active') AS active_hosts,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending_hosts,
        COUNT(*) FILTER (WHERE status = 'banned') AS banned_hosts
      FROM host_profiles;
    `);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("GET /api/admin/hosts/stats ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/hosts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        hp.id,
        hp.user_id,
        u.full_name AS name,
        u.email,
        u.phone,
        u.avatar_url AS avatar,
        hp.company_name,
        hp.location,
        hp.status,
        hp.verification_status,
        hp.joined_at,
        hp.total_listings,
        hp.total_bookings,
        hp.total_earnings
      FROM host_profiles hp
      LEFT JOIN users u ON u.id = hp.user_id
      WHERE hp.id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("GET /api/admin/hosts/:id ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/api/admin/hosts/:id/ban", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE host_profiles SET status = 'banned', updated_at = NOW() WHERE id = $1 RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("PATCH /api/admin/hosts/:id/ban ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/api/admin/hosts/:id/unban", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE host_profiles SET status = 'active', updated_at = NOW() WHERE id = $1 RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("PATCH /api/admin/hosts/:id/unban ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/users", async (req, res) => {
  try {
    const query = `SELECT id, full_name, email, role, status, phone, created_at FROM users ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET /api/admin/users ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/api/admin/users/:id/ban", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE users SET status = 'banned', updated_at = NOW() WHERE id = $1 RETURNING id, full_name, status;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("PATCH /api/admin/users/:id/ban ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/properties", async (req, res) => {
  try {
    const query = `
      SELECT
        p.id,
        p.title,
        p.property_type,
        p.listing_type,
        p.price,
        p.status,
        p.verified,
        p.created_at,
        u.full_name AS host_name
      FROM properties p
      LEFT JOIN users u ON u.id = p.host_id
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET /api/admin/properties ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM properties WHERE id = $1;`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("GET /api/admin/properties/:id ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/api/admin/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM properties WHERE id = $1 RETURNING id;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    res.json({ success: true, message: "Property deleted." });
  } catch (error) {
    console.error("DELETE /api/admin/properties/:id ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/host-verifications", async (req, res) => {
  try {
    const query = `
      SELECT hv.*, u.full_name AS user_name
      FROM host_verifications hv
      LEFT JOIN users u ON u.id = hv.user_id
      ORDER BY hv.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET /api/admin/host-verifications ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/admin/host-verifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM host_verifications WHERE id = $1;`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(
      "GET /api/admin/host-verifications/:id ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/api/admin/host-verifications/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE host_verifications SET status = 'approved', reviewed_at = NOW() WHERE id = $1 RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(
      "PUT /api/admin/host-verifications/:id/approve ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/api/admin/host-verifications/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body || {};
    const result = await pool.query(
      `UPDATE host_verifications SET status = 'rejected', review_notes = $2, reviewed_at = NOW() WHERE id = $1 RETURNING *;`,
      [id, rejectionReason || ""],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(
      "PUT /api/admin/host-verifications/:id/reject ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
