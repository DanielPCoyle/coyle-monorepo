import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Server as NetServer } from "http";
import { Socket as NetSocket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { handleConnection } from "../../util/socketHandlers/handleConnection";

dotenv.config();

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

interface Conversation {
  id: string;
  username: string;
  email: string;
  socketId: string;
}

interface PersonOnSite {
  socketId: string;
  [key: string]: string | number | boolean;
}

const conversations: Conversation[] = [];
const peopleOnSite: PersonOnSite[] = [];

interface SocketServer extends NetServer {
  io?: Server;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithIO;
  if (!socket.server.io) {
    const io = new Server(socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) =>
      handleConnection(socket, io, conversations, peopleOnSite),
    );

    socket.server.io = io; // Store in server object
  }

  res.end();
}
