import { Server, Socket } from "socket.io";
import { addReaction } from "./socketHandlers/addReaction.js";
import { chatMessage } from "./socketHandlers/chatMessage.js";
import { disconnect } from "./socketHandlers/disconnect.js";
import { join } from "./socketHandlers/join.js";
import { leave } from "./socketHandlers/leave.js";
import { login } from "./socketHandlers/login.js";
import { seen } from "./socketHandlers/seen.js";
import { updateMessageAction } from "./socketHandlers/updateMessageAction.js";
import { userTyping } from "./socketHandlers/userTyping.js";

interface PersonOnSite {
  socketId: string;
  [key: string]: string | number | boolean;
}

export function handleConnection(
  socket: Socket,
  io: Server,
  conversations: any[],
  peopleOnSite: PersonOnSite[],
) {
  peopleOnSite.push({ socketId: socket.id });
  io.emit("peopleOnSite", peopleOnSite);
  let typingTimeout: NodeJS.Timeout;

  login({ socket, io, conversations });
  join({ socket, io });
  leave({ socket });
  chatMessage({ socket, io, conversations });
  addReaction({ socket, io });
  updateMessageAction({ socket, io });
  userTyping({ socket, io, typingTimeout });
  seen({ socket, io, conversations });
  disconnect({ socket, io, peopleOnSite, conversations });
}

export default handleConnection;
