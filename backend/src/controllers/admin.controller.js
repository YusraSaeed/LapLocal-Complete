import {Seller} from "../models/seller.model.js";
import { LaptopListing } from "../models/laptopListing.model.js";
import { Buyer } from "../models/buyer.model.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create admin
const registerAdmin = asyncHandler(async (req, res) => {
        const { fullName, email, password, adminSecret } = req.body;
    
        if (!fullName || !email || !password || !adminSecret) {
        throw new ApiError(400, "All fields including admin secret are required");
        }
    
        // Validate secret from env
        if (adminSecret !== process.env.ADMIN_CREATION_SECRET) {
        throw new ApiError(403, "Unauthorized to create admin");
        }
    
        const exists = await Admin.findOne({ email });
        if (exists) throw new ApiError(409, "Admin already exists");
    
        const admin = await Admin.create({ fullName, email, password });
    
        return res.status(201).json(new ApiResponse(201, admin, "Admin created"));
});

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(404, "Admin not found");

    const isCorrect = await admin.isPasswordCorrect(password);
    if (!isCorrect) throw new ApiError(401, "Incorrect password");

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
        new ApiResponse(200, { admin, accessToken, refreshToken }, "Login successful")
        );
});


const approveSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    seller.verificationStatus = true;
    await seller.save();

    return res.status(200).json(
        new ApiResponse(200, seller, "Seller approved successfully")
    );
});

const rejectSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    seller.verificationStatus = false;
    await seller.save();

    return res.status(200).json(
        new ApiResponse(200, seller, "Seller rejected successfully")
    );
});


const getAllSellers = asyncHandler(async (req, res) => {
    const sellers = await Seller.find().select("-password -refreshToken")

    if(!sellers) {
        throw new ApiResponse(500, "Error fetching seller")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, sellers, "Sellers fetched successfully"))
})

const getSellerById = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId)
    .select("-password -refreshToken")
    .populate({
      path: "inventory",
      populate: {
        path: "laptop",
        model: "Laptop"
      }
    });

  if (!seller) throw new ApiError(404, "Seller not found");

  return res.status(200).json(new ApiResponse(200, seller, "Seller found"));
});

// controllers/admin.controller.js or seller.controller.js

export const deleteSellerById = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  // Delete all inventory items linked to this seller
  await LaptopListing.deleteMany({ seller: sellerId });

  // Delete seller
  await Seller.findByIdAndDelete(sellerId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Seller and inventory deleted"));
});


export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error logging out", error: error.message });
  }
};


export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalBuyers = await Buyer.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const verifiedSellers = await Seller.countDocuments({ verificationStatus: true });
    const unverifiedSellers = await Seller.countDocuments({ verificationStatus: false });
    const totalListings = await LaptopListing.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalBuyers,
        totalSellers,
        verifiedSellers,
        unverifiedSellers,
        totalListings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};


export {
    registerAdmin,
    loginAdmin,
    getAllSellers,
    approveSeller,
    rejectSeller,
    getSellerById
}