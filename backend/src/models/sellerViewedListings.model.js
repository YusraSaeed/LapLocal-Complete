// models/sellerViewedListings.model.js

import mongoose from "mongoose";

const sellerViewedListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LaptopListing",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  // sellerViewedListings.model.js
isRead: {
  type: Boolean,
  default: false
}

}, {
  timestamps: true,
});

export const SellerViewedListing = mongoose.model("SellerViewedListing", sellerViewedListingSchema);
