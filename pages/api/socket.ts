import { Server } from "socket.io";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { addConversation } from "../../util/addConversation";
import { addMessage } from "../../util/addMessage";
import { handleConnection } from "../../util/socketHandlers/handleConnection";
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';

dotenv.config();

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const conversations: any[] = [];
const peopleOnSite: any[] = [];

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

        io.on("connection", (socket) => handleConnection(socket, io, conversations, peopleOnSite));

        socket.server.io = io; // Store in server object
    }

    res.end();
}
