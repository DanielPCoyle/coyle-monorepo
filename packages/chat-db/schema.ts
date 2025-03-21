import { type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type User = InferSelectModel<typeof users>;
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  status: text("status").notNull().default("offline"),
  notificationsEnabled: boolean("notifications_enabled")
    .notNull()
    .default(false),
  socketId: text("socket_id"),
  avatarUrl: text("avatar_url"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  sender: varchar("sender", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  seen: boolean("seen").notNull(),
  reactions: jsonb("reactions"), // Add this line
  parentId: integer("parent_id"),
  files: jsonb("files"),
  language: varchar("language", { length: 255 }),
  translation: jsonb("translation"),
});

export type Conversation = InferSelectModel<typeof conversations>;
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  conversationKey: varchar("conversation_key", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  socketId: text("socket_id"),
});

export const knowledge = pgTable("knowledge", {
  id: uuid("id").primaryKey(),
  content: text("content").notNull(),
  embedding: text("embedding").notNull(),
});
