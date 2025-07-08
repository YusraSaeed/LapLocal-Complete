
import jwt from "jsonwebtoken";
import { Buyer } from "../models/buyer.model.js";
import { Seller } from "../models/seller.model.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request: token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user;

    if (decoded.role === "buyer") {
      user = await Buyer.findById(decoded._id).select("-password");
    } else if (decoded.role === "seller") {
      user = await Seller.findById(decoded._id).select("-password");
    } else if (decoded.role === "admin") {
      user = await Admin.findById(decoded._id).select("-password");
    } else {
      throw new ApiError(401, "Invalid user role in token");
    }

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // ✅ New: Check that the user's refreshToken still exists.
    // If the user logged out, the refreshToken will be cleared => block access.
    if (!user.refreshToken) {
      throw new ApiError(401, "Session expired. Please login again.");
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid or expired access token");
  }
});

export { verifyJWT };
