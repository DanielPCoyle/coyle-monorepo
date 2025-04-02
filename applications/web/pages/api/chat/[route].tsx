import * as handlers from "@coyle/chat-api";
import {chatHandler } from "@coyle/chat-api";
export const routes = [
  {
    method: "GET",
    auth: "admin",
    route: "conversations",
    handler: handlers.conversationHandler,
  },
  {
    method: "GET",
    auth: "guest",
    route: "messages",
    handler: handlers.messageHandler,
  }, // TODO: extract guestAuthMiddleware from this handler
  {
    method: "POST",
    auth: "guest",
    route: "update-conversation-language",
    handler: handlers.updateConversationLanguage,
  },
  {
    method: "GET",
    auth: "guest",
    route: "url-preview",
    handler: handlers.urlPreviewHandler,
  },
  {
    method: "POST",
    auth: "guest",
    route: "translate",
    handler: handlers.translateHeader,
  },
  {
    method: "OPTIONS",
    auth: "guest",
    route: "send-message-as-email",
    handler: handlers.sendMessageAsEmailHandler,
  },
  {
    method: "GET",
    auth: "admin",
    route: "admin-users",
    handler: handlers.adminUsersHandler,
  },
  {
    method: "GET",
    auth: "admin",
    route: "get-user",
    handler: handlers.getUserHandler,
  },
  {
    method: "PATCH",
    auth: "admin",
    route: "update-profile",
    handler: handlers.updateProfileHandler,
  },
];


export default (req,res)=>chatHandler(req,res,routes)