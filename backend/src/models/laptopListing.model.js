import mongoose, { Schema, model } from "mongoose";

const laptopListingSchema = new Schema(
    {
        laptop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Laptop",
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },

        price: {
            type: String,
            required: true,
        },

        condition: {
            type: String,
            required: true,
        },

        quantityAvailable: {
            type: Number,
            required: true,
        },

        images: [String], // Seller-specific images

        isAvailable: {
            type: Boolean,
            default: true,
        },
        specifications: {
            type: Map,
            of: String
        }
    },
    {
        timestamps: true,
    }
);

export const LaptopListing = model("LaptopListing", laptopListingSchema);
