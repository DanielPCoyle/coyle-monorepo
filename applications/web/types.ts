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
