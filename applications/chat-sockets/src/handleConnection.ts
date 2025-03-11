import { Server, Socket } from "socket.io";
import { addReaction } from "./socketHandlers/addReaction";
import { chatMessage } from "./socketHandlers/chatMessage";
import { disconnect } from "./socketHandlers/disconnect";
import { join } from "./socketHandlers/join";
import { leave } from "./socketHandlers/leave";
import { login } from "./socketHandlers/login";
import { seen } from "./socketHandlers/seen";
import { updateMessageAction } from "./socketHandlers/updateMessageAction";
import { userTyping } from "./socketHandlers/userTyping";
import { updateUserStatus, getUsersOnline, updateUserNotificationsEnabled } from "@coyle/database";
interface PersonOnSite {
  socketId: string;
  [key: string]: string | number | boolean;
}

export function handleConnection(
  socket: Socket,
  io: Server,
  conversations: unknown[],
  peopleOnSite: PersonOnSite[],
) {
  peopleOnSite.push({ socketId: socket.id });
  io.emit("peopleOnSite", peopleOnSite);
  let typingTimeout: NodeJS.Timeout;

  login({ socket, io, conversations });
  join({ socket, io });
  leave({ socket });
  chatMessage({ socket, io });
  addReaction({ socket, io });
  updateMessageAction({ socket, io });
  userTyping({ socket, io, typingTimeout });
  seen({ socket, io, conversations });
  disconnect({ socket, io, peopleOnSite, conversations });

  socket.on("updateStatus", async ({ status, id }) => {
    await updateUserStatus({ status, id });
    const onlineUsers = await getUsersOnline();
    io.emit("adminsOnline", onlineUsers);
  });

  socket.on("updateNotificationsEnabled", async ({ notificationsEnabled, id }) => {
    console.log({ notificationsEnabled, id });
    await updateUserNotificationsEnabled({ notificationsEnabled, id });
  });
}

export default handleConnection;
