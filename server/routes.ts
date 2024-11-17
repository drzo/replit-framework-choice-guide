import type { Express } from "express";
import { db } from "../db";
import { recommendations } from "../db/schema";

export function registerRoutes(app: Express) {
  // Save framework recommendations for future analysis
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { projectType, requirements, recommendedFramework } = req.body;
      const result = await db.insert(recommendations).values({
        projectType,
        requirements,
        recommendedFramework,
        createdAt: new Date().toISOString(),
      }).returning();
      
      res.json(result[0]);
    } catch (error) {
      console.error("Error saving recommendation:", error);
      res.status(500).json({ error: "Failed to save recommendation" });
    }
  });

  // Get recommendation statistics
  app.get("/api/recommendations/stats", async (_req, res) => {
    try {
      const allRecommendations = await db.select().from(recommendations);
      res.json({
        total: allRecommendations.length,
        byFramework: allRecommendations.reduce((acc, curr) => {
          acc[curr.recommendedFramework] = (acc[curr.recommendedFramework] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });
}
