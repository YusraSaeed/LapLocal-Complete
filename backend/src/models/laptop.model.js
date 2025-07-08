import mongoose, { Schema, model } from "mongoose";

const laptopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
        },
    
        
    },
    {
        timestamps: true,
    }
);

export const Laptop = model("Laptop", laptopSchema);
