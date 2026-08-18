const express = require("express");
const pool = require("../config/db");
const { upload } = require("../config/upload");

const router = express.Router();

router.get("/api/properties", async (req, res) => {
  try {
    const {
      type,
      location,
      minPrice,
      maxPrice,
      category,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
    } = req.query;

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (type) {
      const dbListingType =
        type.toLowerCase() === "buy" ? "sale" : type.toLowerCase();
      conditions.push(`p.listing_type = $${paramIndex++}`);
      params.push(dbListingType);
    }

    if (location && location.trim() !== "") {
      conditions.push(`(
        LOWER(COALESCE(p.city, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(p.state, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(p.country, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(p.address, '')) LIKE $${paramIndex}
      )`);
      params.push(`%${location.trim().toLowerCase()}%`);
      paramIndex++;
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      conditions.push(`p.price >= $${paramIndex++}`);
      params.push(Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      conditions.push(`p.price <= $${paramIndex++}`);
      params.push(Number(maxPrice));
    }

    if (category) {
      const categories = Array.isArray(category)
        ? category
        : category
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

      if (categories.length > 0) {
        conditions.push(`p.property_type = ANY($${paramIndex++}::text[])`);
        params.push(categories);
      }
    }

    if (bedrooms && bedrooms !== "Any") {
      const bedNum = Number(bedrooms.replace("+", ""));
      if (!isNaN(bedNum)) {
        conditions.push(`p.bedrooms >= $${paramIndex++}`);
        params.push(bedNum);
      }
    }

    if (minArea && !isNaN(Number(minArea))) {
      conditions.push(`p.area >= $${paramIndex++}`);
      params.push(Number(minArea));
    }

    if (maxArea && !isNaN(Number(maxArea))) {
      conditions.push(`p.area <= $${paramIndex++}`);
      params.push(Number(maxArea));
    }

    if (amenities) {
      const amenList = Array.isArray(amenities)
        ? amenities
        : amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);

      amenList.forEach((amen) => {
        conditions.push(
          `EXISTS (SELECT 1 FROM property_amenities pa WHERE pa.property_id = p.id AND LOWER(pa.amenity) = LOWER($${paramIndex++}))`,
        );
        params.push(amen);
      });
    }

    if (bathrooms && bathrooms !== "Any") {
      const bathNum = Number(bathrooms.replace("+", ""));
      if (!isNaN(bathNum)) {
        conditions.push(`p.baths >= $${paramIndex++}`);
        params.push(bathNum);
      }
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const query = `
      SELECT
        p.id,
        p.host_id,
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
        array_remove(array_agg(DISTINCT pa.amenity), NULL) AS amenities,
        COALESCE(
          CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state, ''), NULLIF(p.country, '')),
          p.address,
          'Unknown Location'
        ) AS location,
        p.created_at
      FROM properties p
      LEFT JOIN property_amenities pa ON pa.property_id = p.id
      ${whereClause}
      GROUP BY p.id, p.host_id, p.title, p.description, p.property_type, p.listing_type, p.address, p.city, p.state, p.country, p.latitude, p.longitude, p.beds, p.bedrooms, p.baths, p.guests, p.price, p.currency, p.price_period, p.status, p.verified, p.main_image_url, p.created_at
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("❌ SQL ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/api/reports", upload.array("files", 5), async (req, res) => {
  try {
    const { propertyId, reason, description } = req.body;
    const files = req.files || [];

    res.json({
      success: true,
      message: "Report submitted successfully.",
      data: {
        propertyId,
        reason,
        description,
        files: files.map((f) => f.filename),
      },
    });
  } catch (error) {
    console.error("POST /api/reports ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        p.id,
        p.host_id,
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
        array_remove(array_agg(DISTINCT pa.amenity), NULL) AS amenities
      FROM properties p
      LEFT JOIN property_amenities pa ON pa.property_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.host_id, p.title, p.description, p.property_type, p.listing_type, p.address, p.city, p.state, p.country, p.latitude, p.longitude, p.beds, p.bedrooms, p.baths, p.guests, p.price, p.currency, p.price_period, p.status, p.verified, p.main_image_url;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ SQL ERROR (/api/properties/:id):", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
