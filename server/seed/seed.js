import dotenv from "dotenv";
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import { portfolioSeed } from "./seedData.js";

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  console.error("No MongoDB URI found. Set MONGODB_URI in server/.env or your shell environment.");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
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
