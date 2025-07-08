import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Buyer",
            required: true,
        },
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
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            enum: ["buyer", "seller"],
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Chat = model("Chat", chatSchema);

