import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { handleConnection } from "./handleConnection";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN.split(","),
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN.split(","),
    methods: ["GET", "POST"],
  },
});

// Express route
app.get("/", (req: Request, res: Response) => {
  void req;
  res.send("Socket.io server is running....");
});

// Handle WebSocket connections
io.on("connection", (socket: Socket) => {
  handleConnection(socket, io);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  io.close(() => {
    console.log("Socket.io server closed");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});
