import type { Express } from "express";
import { db } from "../db";
import { recommendations, promptHistory } from "../db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Save framework recommendations for future analysis
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { projectType, requirements, recommendedFramework } = req.body;
      
      if (!projectType || !requirements || !recommendedFramework) {
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "projectType, requirements, and recommendedFramework are required" 
        });
      }

      const result = await db.insert(recommendations).values({
        projectType,
        requirements,
        recommendedFramework,
        createdAt: new Date().toISOString(),
      }).returning();
      
      res.json(result[0]);
    } catch (error) {
      console.error("Error saving recommendation:", error);
      res.status(500).json({ 
        error: "Failed to save recommendation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
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
      res.status(500).json({ 
        error: "Failed to fetch statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Save prompt history
  app.post("/api/prompts", async (req, res) => {
    try {
      const { projectName, projectType, description, requirements, prompt, recommendation } = req.body;
      
      if (!projectName || !projectType || !description || !requirements || !prompt || !recommendation) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: "All fields are required: projectName, projectType, description, requirements, prompt, recommendation"
        });
      }

      const result = await db.insert(promptHistory).values({
        projectName,
        projectType,
        description,
        requirements,
        prompt,
        recommendation,
        createdAt: new Date().toISOString(),
      }).returning();
      
      res.json(result[0]);
    } catch (error) {
      console.error("Error saving prompt:", error);
      res.status(500).json({ 
        error: "Failed to save prompt",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get prompt history
  app.get("/api/prompts", async (_req, res) => {
    try {
      const history = await db.select()
        .from(promptHistory)
        .orderBy(promptHistory.createdAt);
      res.json(history);
    } catch (error) {
      console.error("Error fetching prompt history:", error);
      res.status(500).json({ 
        error: "Failed to fetch prompt history",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
