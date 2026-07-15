import dotenv from "dotenv";
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import { portfolioSeed } from "./seedData.js";

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    await Portfolio.deleteMany({});
    await Portfolio.create(portfolioSeed);

    console.log("Portfolio data seeded successfully.");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
