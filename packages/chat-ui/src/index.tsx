import React from "react";
import ReactDOM from "react-dom/client";

import { ChatCaddy } from "./ChatCaddy";
import { Chat } from "./Chat"; // Ensure Chat is a valid React component
export { ChatCaddy, Chat };
export default ChatCaddy;


const root = ReactDOM.createRoot(document.getElementById("chatCaddyRoot")!);
root.render(<ChatCaddy />); // Ensure Chat is used as a JSX element
