import { createContext } from "react";

interface ChatContextType {
  id: string;
  userName: string;
  setUser: (user: any) => void;
  setUserName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setToken: (token: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setId: (id: string) => void;
  user: any;
  status: string;
  conversations: any[];
  setConversations: (conversations: any[]) => void;
  socket: any;
  setSocket: (socket: any) => void;
  toggleDrawer: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  setMessage: (message: string) => void;
  messages: any[];
  admins: any[];
  setAdmins: (admins: any[]) => void;
  setMessages: (messages: any[]) => void;
  setStatus: (status: string) => void;
  notificationsEnabled: boolean;
  token: string;
  typing: boolean;
  setTyping: (typing: boolean) => void;
  files: any[];
  setFiles: (files: any[]) => void;
  setInput: (input: string) => void;
  input: string;
}

export const ChatContext = createContext<ChatContextType | null>(null);
export default ChatContext;
