import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Autonomous jobs table
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  company: text('company').notNull(),
  portal: text('portal').notNull(),
  location: text('location').notNull(),
  salary: text('salary'),
  relevanceScore: integer('relevance_score').default(90),
  status: text('status').default('DISCOVERED'),
  jobDescription: text('job_description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Prioritized agent tasks table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  agentType: text('agent_type').notNull(),
  priority: text('priority').notNull(),
  agenticScore: integer('agentic_score').default(85),
  riskLevel: text('risk_level').default('LOW'),
  status: text('status').default('PENDING'),
  concurrencyBucket: text('concurrency_bucket').default('IMMEDIATE_DISPATCH'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cryptographic agent audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  agentType: text('agent_type').notNull(),
  action: text('action').notNull(),
  target: text('target').notNull(),
  details: text('details').notNull(),
  result: text('result').notNull(),
  traceId: text('trace_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  tasks: many(tasks),
  auditLogs: many(auditLogs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
