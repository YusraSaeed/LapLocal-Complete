

import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const buyerSchema = new Schema(
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
        required: function () {
            return this.provider === "email";
        },
        },

        role: {
        type: String,
        enum: ["buyer"],
        default: "buyer",
        },

        phone: {
        type: String,
        },

        address: {
        type: String,
        },

        language: {
        type: String,
        default: "English",
        },

        socialId: {
        type: String,
        unique: true,
        sparse: true,
        },

        provider: {
        type: String,
        enum: ["google", "facebook", "apple", "email"],
        default: "email",
        },

        recommendations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LaptopListing",
        },
        ],

        refreshToken: {
        type: String,
        },

        resetPasswordToken: String,
        resetPasswordExpiry: Date,

        // 🧠 Recommendation Tracking
        recentSearches: [
        {
            keyword: String,
            timestamp: {
            type: Date,
            default: Date.now,
            },
        },
        ],

        viewedListings: [
        {
            listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LaptopListing",
            },
            timestamp: {
            type: Date,
            default: Date.now,
            },
        },
        ],

        appliedFilters: [
        {
            filters: mongoose.Schema.Types.Mixed, // stores a JSON object
            timestamp: {
            type: Date,
            default: Date.now,
            },
        },
        ],

        engagedListings: [
        {
            listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LaptopListing",
            },
            type: {
            type: String,
            enum: ["chat"],
            },
            timestamp: {
            type: Date,
            default: Date.now,
            },
        },
        ],
    },
    {
        timestamps: true,
    }
);

// 🔐 Hash password
buyerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password
buyerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔐 Generate access token
buyerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// 🔁 Generate refresh token
buyerSchema.methods.generateRefreshToken = function () {
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

export const Buyer = model("Buyer", buyerSchema);
