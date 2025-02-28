import { getDB, schema } from "@coyle/database";
import { Server, Socket } from "socket.io";
import { addReaction } from "./addReaction.js";
import { chatMessage } from "./chatMessage.js";
import { disconnect } from "./disconnect.js";
import { join } from "./join.js";
import { leave } from "./leave.js";
import { login } from "./login.js";
import { mouseMoveUpdatePeopleOnSite } from "./mouseMoveUpdatePeopleOnSite.js";
import { seen } from "./seen.js";
import { updateMessageAction } from "./updateMessageAction.js";
import { userTyping } from "./userTyping.js";

const {conversations:convos, messages} = schema;

interface PersonOnSite {
  socketId: string;
  [key: string]: string | number | boolean;
}

export function handleConnection(
  socket: Socket,
  io: Server,
  conversations: any[],
  peopleOnSite: PersonOnSite[]) {
  const db = getDB() as any;
  peopleOnSite.push({ socketId: socket.id });
  io.emit("peopleOnSite", peopleOnSite);
  let typingTimeout: NodeJS.Timeout;

  login({socket,io,conversations})
  join({socket,io})
  leave({socket})
  chatMessage({socket,io,conversations,convos, messages, db})
  addReaction({socket,io,messages,db});
  updateMessageAction({socket,io})
  userTyping({socket,io,typingTimeout})
  seen({socket,io,messages,db,conversations})
  mouseMoveUpdatePeopleOnSite({socket,io,peopleOnSite})
  disconnect({socket,io,peopleOnSite,conversations,})
  
}


export default handleConnection;





