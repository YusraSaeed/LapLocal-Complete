import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js"; // adjust path as needed
import { LaptopListing } from "../models/laptopListing.model.js";
import { Seller } from "../models/seller.model.js";

dotenv.config();

const syncInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB");

    const listings = await LaptopListing.find();

    if (!listings.length) {
      console.log("⚠️ No listings found in the database.");
      return process.exit(0);
    }

    // Map of sellerId to listingIds
    const sellerInventoryMap = {};

    for (const listing of listings) {
      const sellerId = listing.seller?.toString();
      if (!sellerId) continue;

      if (!sellerInventoryMap[sellerId]) {
        sellerInventoryMap[sellerId] = [];
      }

      sellerInventoryMap[sellerId].push(listing._id);
    }

    // Update sellers
    for (const [sellerId, listingIds] of Object.entries(sellerInventoryMap)) {
      await Seller.findByIdAndUpdate(
        sellerId,
        { $addToSet: { inventory: { $each: listingIds } } }, // prevent duplicates
        { new: true }
      );
      console.log(`📦 Synced ${listingIds.length} listings to seller ${sellerId}`);
    }

    console.log("✅ Inventory syncing completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing inventory:", err);
    process.exit(1);
  }
};

syncInventory();
