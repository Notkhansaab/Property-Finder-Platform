const express = require("express");
const pool = require("../config/db");
const { getIO } = require("../config/socket");

const router = express.Router();

router.post("/api/conversations", async (req, res) => {
  try {
    const { host_id, guest_id, property_id } = req.body;

    if (!host_id || !guest_id || !property_id) {
      return res.status(400).json({
        success: false,
        message: "host_id, guest_id and property_id are required.",
      });
    }

    const query = `
      INSERT INTO conversations (host_id, guest_id, property_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;

    const result = await pool.query(query, [host_id, guest_id, property_id]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("POST /api/conversations ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/conversations/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT 
        c.id AS conversation_id,
        c.id,
        c.property_id,
        c.host_id,
        c.guest_id,
        c.last_message,
        c.last_message_at AS last_message_time,
        c.unread_count,
        c.created_at,
        c.updated_at,
        CASE 
          WHEN c.host_id = $1 THEN u_guest.full_name
          ELSE u_host.full_name
        END AS partner_name,
        CASE 
          WHEN c.host_id = $1 THEN u_guest.id
          ELSE u_host.id
        END AS partner_id
      FROM conversations c
      LEFT JOIN users u_host ON u_host.id = c.host_id
      LEFT JOIN users u_guest ON u_guest.id = c.guest_id
      WHERE c.host_id = $1 OR c.guest_id = $1
      ORDER BY c.updated_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET /api/conversations/user/:userId ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/debug/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM conversations WHERE host_id = $1 OR guest_id = $1;`,
      [userId],
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("DEBUG /api/debug/conversations ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/api/conversations/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const query = `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC;`;
    const result = await pool.query(query, [conversationId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(
      "GET /api/conversations/:conversationId/messages ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/api/conversations/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { sender_id, message_text } = req.body;

    if (!sender_id || !message_text) {
      return res.status(400).json({
        success: false,
        message: "sender_id and message_text are required.",
      });
    }

    const insertQuery = `
      INSERT INTO messages (conversation_id, sender_id, message_text, sent_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;

    const insertResult = await pool.query(insertQuery, [
      conversationId,
      sender_id,
      message_text,
    ]);

    const message = insertResult.rows[0];

    const convQuery = `
      SELECT host_id, guest_id
      FROM conversations
      WHERE id = $1;
    `;
    const convResult = await pool.query(convQuery, [conversationId]);
    const conversation = convResult.rows[0];

    const io = getIO();
    if (io && conversation) {
      const payload = {
        ...message,
        conversation_id: Number(conversationId),
        sender_id: Number(sender_id),
        sender_name: "You",
      };

      io.to(`user:${conversation.host_id}`).emit("new_message", payload);
      io.to(`user:${conversation.guest_id}`).emit("new_message", payload);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error(
      "POST /api/conversations/:conversationId/messages ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/api/conversations/:conversationId/read", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { reader_id } = req.body;

    const query = `UPDATE conversations SET unread_count = 0, updated_at = NOW() WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [conversationId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found." });
    }

    res.json({ success: true, data: result.rows[0], reader_id });
  } catch (error) {
    console.error(
      "PUT /api/conversations/:conversationId/read ERROR:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
