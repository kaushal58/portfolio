import { Router } from "express";
import Portfolio from "../models/Portfolio.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const portfolio = await Portfolio.findOne().lean();
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found. Run npm run seed in the server folder." });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
  }
});

export default router;
