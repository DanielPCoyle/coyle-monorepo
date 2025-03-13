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
}

export const ChatContext = createContext<ChatContextType | null>(null);
export default ChatContext;
