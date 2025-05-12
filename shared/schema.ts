import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  teamA: text("team_a").notNull(),
  teamB: text("team_b").notNull(),
  matchFormat: text("match_format").notNull(),
  gender: text("gender").notNull(),
  matchDate: text("match_date").notNull(),
  stadium: text("stadium").notNull(),
  teamAScore: integer("team_a_score"),
  predictionMode: text("prediction_mode").notNull(), // pre-match or post-innings
  teamAWinPercentage: integer("team_a_win_percentage").notNull(),
  teamBWinPercentage: integer("team_b_win_percentage").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  predictionData: json("prediction_data"),
  weatherData: json("weather_data")
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  fromAdmin: boolean("from_admin").default(false).notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  content: true,
  fromAdmin: true
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Prediction form schema
export const predictionFormSchema = z.object({
  teamA: z.string().min(1, "Team A is required"),
  teamB: z.string().min(1, "Team B is required"),
  matchFormat: z.enum(["ODI", "T20"]),
  gender: z.enum(["Male", "Female"]),
  matchDate: z.string().min(1, "Match date is required"),
  stadium: z.string().min(1, "Stadium is required"),
  teamAScore: z.number().optional().nullable(),
  predictionMode: z.enum(["pre-match", "post-innings"])
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PredictionFormValues = z.infer<typeof predictionFormSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
