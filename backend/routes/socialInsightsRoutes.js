import express from "express";
import { fetchTweets, analyzeSeverity } from "../services/socialInsightsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tweets = await fetchTweets();

    const analyzed = await Promise.all(
      tweets.map(async (t) => {
        const severity = await analyzeSeverity(t.text);
        return {
          id: t.id,
          platform: t.platform,
          content: t.text,
          author: "Unknown",
          timestamp: t.timestamp,
          severity,
          location: "Unknown",
        };
      })
    );

    res.json(analyzed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

export default router;
