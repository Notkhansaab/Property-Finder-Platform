const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  host: String(process.env.DB_HOST || "").trim(),
  port: Number(process.env.DB_PORT || 5432),
  database: String(process.env.DB_NAME || "").trim(),
  user: String(process.env.DB_USER || "").trim(),
  password: String(process.env.DB_PASSWORD || "").trim(),
});

pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  })
  .catch((error) => {
    console.error("❌ PostgreSQL connection failed:");
    console.error(error.message);
  });

module.exports = pool;
