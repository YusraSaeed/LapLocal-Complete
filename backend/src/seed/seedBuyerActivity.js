// scripts/seedBuyerActivity.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import {Buyer} from "../models/buyer.model.js"
import { LaptopListing } from "../models/laptopListing.model.js";
import {DB_NAME} from "../constants.js"

dotenv.config();

const sampleSearchTerms = ["HP", "Dell", "i7", "8GB", "Touch", "Elitebook"];
const sampleFilterTemplates = [
  { ram: "8GB", storage: "256GB" },
  { ram: "16GB", storage: "512GB", systemType: "64-bit" },
  { condition: "Used", color: "Black" },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
          dbName: DB_NAME
        });
        console.log(`Successfully Connected to MongoDB Database`);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

const seedBuyerActivity = async () => {
  try {
    const buyers = await Buyer.find();
    const listings = await LaptopListing.find();

    if (!buyers.length || !listings.length) {
      throw new Error("No buyers or listings found.");
    }

    for (const buyer of buyers) {
      const recentSearches = Array.from({ length: 3 }, () => ({
        keyword: sampleSearchTerms[Math.floor(Math.random() * sampleSearchTerms.length)],
      }));

      const viewedListings = Array.from({ length: 3 }, () => ({
        listing: listings[Math.floor(Math.random() * listings.length)]._id,
      }));

      const appliedFilters = Array.from({ length: 2 }, () => ({
        filters: sampleFilterTemplates[Math.floor(Math.random() * sampleFilterTemplates.length)],
      }));

      const engagedListings = Array.from({ length: 2 }, () => ({
        listing: listings[Math.floor(Math.random() * listings.length)]._id,
        type: "chat",
      }));

      await Buyer.findByIdAndUpdate(buyer._id, {
        $set: {
          recentSearches,
          viewedListings,
          appliedFilters,
          engagedListings,
        },
      });

      console.log(`✅ Seeded activity for buyer: ${buyer.email}`);
    }

    console.log("🎉 Buyer activity seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

await connectDB();
await seedBuyerActivity();
