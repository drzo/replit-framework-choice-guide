import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Store framework recommendations for future machine learning
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  projectType: text("project_type").notNull(),
  requirements: jsonb("requirements").notNull(),
  recommendedFramework: text("recommended_framework").notNull(),
  userFeedback: serial("user_feedback"), // 1-5 rating
  createdAt: text("created_at").notNull().default("NOW()"),
});

// Store prompt history
export const promptHistory = pgTable("prompt_history", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").notNull(),
  prompt: text("prompt").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertRecommendationSchema = createInsertSchema(recommendations);
export const selectRecommendationSchema = createSelectSchema(recommendations);
export const insertPromptHistorySchema = createInsertSchema(promptHistory);
export const selectPromptHistorySchema = createSelectSchema(promptHistory);

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = z.infer<typeof selectRecommendationSchema>;
export type InsertPromptHistory = z.infer<typeof insertPromptHistorySchema>;
export type PromptHistory = z.infer<typeof selectPromptHistorySchema>;
