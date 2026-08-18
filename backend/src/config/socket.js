const { Server } = require("socket.io");

let io;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const initSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
    });

    socket.on("leave", (userId) => {
      if (!userId) return;
      socket.leave(`user:${userId}`);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
