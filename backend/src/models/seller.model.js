import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sellerSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        phone: {
            type: String, // String to allow country codes
            required: true,
        },

        shopName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        shopNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        shopAddress: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        verificationStatus: {
            type: Boolean,
            default: false, // Can be set to true by admin
        },

        role: {
            type: String,
            enum: ["seller"],
            default: "seller"
        },        
        inventory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LaptopListing",
            },
        ],
        
        ratings: [
            {
                buyer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Buyer",
                    required: true
                },
                listing: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "LaptopListing",
                    required: true
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                    required: true
                },
                review: {
                    type: String
                }
            }
        ],
        averageRating: {
            type: Number,
            default: 0
        },

        refreshToken: {
            type: String,
        },
        resetPasswordToken: String,
        resetPasswordExpiry: Date
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
sellerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
sellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
sellerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            shopName: this.shopName,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
sellerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Seller = model("Seller", sellerSchema);

