import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  password_hash: text('password_hash').notNull(),
  is_active: boolean('is_active').notNull(),
  role: text('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  last_login: timestamp('last_login')
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversation_id: integer('conversation_id').notNull(),
  sender: varchar('sender', { length: 255 }).notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  seen: boolean('seen').notNull(),
  parent_id: integer('parent_id'),
  reaction: jsonb('reaction'),
  files: jsonb('files')
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  conversation_key: varchar('conversation_key', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const knowledge = pgTable('knowledge', {
  id: uuid('id').primaryKey(),
  content: text('content').notNull(),
  embedding: text('embedding').notNull()
});

export const getAStoreSignUps = pgTable('get_a_store_signups', {
    id: serial('id').primaryKey(),
    organization_name: text('organization_name').notNull(),
    contact_person: text('contact_person').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    website: text('website').notNull(),
    store_domain: text('store_domain').notNull(),
    custom_domain: boolean('custom_domain').notNull(),
    products: text('products').notNull(),
    order_fulfillment: text('order_fulfillment').notNull(),
    additional_requests: text('additional_requests').notNull()
});
