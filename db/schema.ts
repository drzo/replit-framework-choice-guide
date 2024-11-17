import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Store framework recommendations for future machine learning
export const recommendations = pgTable("recommendations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectType: text("project_type").notNull(),
  requirements: jsonb("requirements").notNull(),
  recommendedFramework: text("recommended_framework").notNull(),
  userFeedback: integer("user_feedback"), // 1-5 rating
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertRecommendationSchema = createInsertSchema(recommendations);
export const selectRecommendationSchema = createSelectSchema(recommendations);
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = z.infer<typeof selectRecommendationSchema>;
