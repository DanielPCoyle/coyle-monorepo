import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { handleConnection } from "./handleConnection";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust as needed
    methods: ["GET", "POST"],
  },
});

// Express route
app.get("/", (req: Request, res: Response) => {
  void req; // to avoid 'req' is declared but its value is never read
  res.send("Socket.io server is running");
});

interface Conversation {
  id: string;
  participants: string[];
  messages: string[];
}

interface Person {
  socketId: string;
  [key: string]: string | number | boolean;
}

const conversations: Conversation[] = [];
const peopleOnSite: Person[] = [];

// Handle WebSocket connections
io.on("connection", (socket: Socket) => {
  handleConnection(socket, io, conversations, peopleOnSite);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
