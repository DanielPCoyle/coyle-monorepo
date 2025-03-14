import React from "react";
import React, { RefObject } from "react";
import type { Socket } from "socket.io-client";
import { Message } from "./types";

interface Conversation {
  id: string;
  user: string;
  email: string;
  status: string;
  unSeenMessages: number;
  conversationKey: string;
  isActive: boolean;
  name: string;
}
export interface ConversationListItemsProps {
  conversations: Conversation[];
  socket: Socket;
  toggleDrawer: () => void;
}

export interface AdminLoginProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export interface GuestLoginProps {
  userName: string;
  setUserName: (userName: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export interface FormattingBarProps {
  toggleInlineStyle: (style: string) => void;
  toggleBlockType: (type: string) => void;
}

export interface MessageAddonsProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  emojiPickerRef: RefObject<HTMLDivElement>;
  insertEmoji: (emoji: string) => void;
  typing: { name: string; } | null;
}

export interface ThumbnailProps {
  files: File[];
  file: File;
  index: number;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  children?: React.ReactNode;
}

export interface ReactionPickerProps {
  reactionsPickerRef: RefObject<HTMLDivElement>;
}

export interface ReactionsProps {
  isSender: boolean;
  reactions: { [key: string]: string[]; };
  removeReactions: (reactions: { emoji: string; }) => void;
}

export interface SubMessageType { }
{
  reply: MessageType;
  user: string;
  socket: Socket;
  email: string;
}

export interface Message {
  files?: string[];
}

export interface FilePreviewProps {
  message: Message;
}

interface Message {
  message: string;
}
export interface UrlPreview {
  url: string;
  type?: string;
  title?: string;
  description?: string;
  image?: string;
}
export interface LinkPreviewProps {
  message: Message;
}

export interface MessageType {
  id: string;
  text: string;
  user: string;
  parentId?: string;
  conversationKey: string;
  sender: string;
  message: string;
  createdAt: string;
  seen: boolean;
  reactions: Record<string, string[]>;
  files: string[];
  replies: MessageType[];
}

export interface ChatContextType {
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
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setModalSource: (source: string[]) => void;
  setModalIndex: (index: number) => void;
}

export type { NextApiRequest, NextApiResponse } from "next";
export interface Message {
  id: number;
  conversationKey: number;
  sender: string;
  message: string;
  createdAt: string;
  seen: boolean;
  reactions: Record<string, string[]>;
  parentId: number | null;
  files: any[];
  replies: any[];
}

export interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
  role: string;
}
