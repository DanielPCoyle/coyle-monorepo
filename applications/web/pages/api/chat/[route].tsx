import * as handlers from "@simpler-development/chat-api";
import { chatHandler } from "@simpler-development/chat-api";
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
  },
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
  {
    method: "GET",
    auth: null,
    route: "cookie",
    handler: handlers.cookieHandler,
  },
  {
    method: "POST",
    auth: "admin",
    route: "register",
    handler: handlers.registerHandler,
  },
  {
    method: "POST",
    auth: null,
    route: "login",
    handler: handlers.loginHandler,
  },
  {
    method: "GET",
    auth: null,
    route: "me",
    handler: handlers.meHandler,
  },
  {
    method: "GET",
    auth: null,
    route: "guest-token",
    handler: handlers.guestTokenHandler,
  },
];

export default (req, res) => chatHandler(req, res, routes);
