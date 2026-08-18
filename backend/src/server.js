require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Estate Link backend running on http://localhost:${PORT}`);
});
