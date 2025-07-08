// controllers/auth.controller.js
import { Buyer } from "../models/buyer.model.js";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateResetToken } from "../utils/generateResetToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userRole = req.userRole;
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    // Get the correct model
    const Model = userRole === "buyer" ? Buyer : Seller;
    const user = await Model.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Use model method to verify password
    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword; // will be hashed by pre("save")
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});


export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    throw new ApiError(400, "Email and role are required");
  }

  const Model = role === "buyer" ? Buyer : Seller;
  const user = await Model.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { rawToken, hashedToken, expiry } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = expiry;
  await user.save({ validateBeforeSave: false });

  // const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}?role=${role}`;
  const resetLink = `${process.env.CLIENT_URL.replace(/\/$/, '')}/reset-password/${rawToken}?role=${role}`;


  await sendEmail({
  to: user.email,
  subject: "Reset Your LapLocal Password",
  text: `
Hi ${user.fullName || "User"},

Click the link below to reset your password. This link will expire in 15 minutes:

${resetLink}

If you didn’t request this, you can ignore this email.
  `,
  html: `
    <p>Hi ${user.fullName || "User"},</p>
    <p>Click the link below to reset your password. This link will expire in 15 minutes:</p>
    <p><a href="${resetLink}" target="_blank" style="color: #2b6cb0;">${resetLink}</a></p>
    <p>If you didn’t request this, you can ignore this email.</p>
  `
});



  return res.status(200).json(
    new ApiResponse(200, null, "Password reset link sent to your email (mocked)")
  );
});



import crypto from "crypto";

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, role } = req.body;

  if (!newPassword || !role) {
    throw new ApiError(400, "New password and role are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const Model = role === "buyer" ? Buyer : Seller;

  const user = await Model.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Password reset successfully")
  );
});


