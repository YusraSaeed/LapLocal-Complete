import { Chat } from "../models/chat.model.js";
import { LaptopListing } from "../models/laptopListing.model.js";
import { Buyer } from "../models/buyer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io, onlineUsers } from "../app.js"; // Your socket setup
import mongoose from "mongoose";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const senderRole = req.userRole; // "buyer" or "seller"
  const { listingId, sellerId, message } = req.body;

  if (!listingId || !sellerId || !message) {
    throw new ApiError(400, "Missing required fields");
  }

  // Find listing and include laptop info
  const listing = await LaptopListing.findById(listingId).populate("laptop");
  if (!listing) {
    throw new ApiError(404, "Laptop listing not found");
  }

  const buyerId = senderRole === "buyer" ? senderId : req.body.buyerId;
  const chatMessage = await Chat.create({
    buyer: buyerId,
    seller: sellerId,
    listing: listingId,
    message,
    sender: senderRole,
    read: false
  });

  // Determine the recipient and emit notification
  const recipientId = senderRole === "buyer" ? sellerId : buyerId;
  const recipient = onlineUsers.get(recipientId.toString());

  if (recipient) {
    io.to(recipient.socketId).emit("newMessage", {
      _id: chatMessage._id,
      message,
      sender: senderRole,
      listing: {
        _id: listing._id,
        name: listing.laptop.name,
        brand: listing.laptop.brand,
        price: listing.price,
        specifications: listing.specifications,
      },
      timestamp: chatMessage.createdAt,
      notification: `${senderRole} sent a new message`
    });
  }

  if (req.userRole === "buyer") {
    await Buyer.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        engagedListings: {
          listing: listingId,
          type: "chat",
        },
      },
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, chatMessage, "Message sent successfully"));
});


export const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.userRole; // 'buyer' or 'seller'

  const chats = await Chat.find({
    $or: [
      { buyer: userId },
      { seller: userId }
    ]
  })
    .populate("listing", "laptop price specifications")
    .populate("buyer", "fullName")
    .populate("seller", "fullName")
    .sort({ updatedAt: -1 }); // Ensure most recent message comes first

  const uniqueConversations = new Map();

  chats.forEach(chat => {
    const listingId = chat.listing?._id?.toString();
    const buyerId = chat.buyer?._id?.toString();
    const sellerId = chat.seller?._id?.toString();

    const convoKey = `${listingId}_${buyerId}_${sellerId}`;

    if (!uniqueConversations.has(convoKey)) {
      uniqueConversations.set(convoKey, {
        listing: chat.listing,
        buyer: chat.buyer,
        seller: chat.seller,
        lastMessage: chat.message,
        read: chat.read,
        sender: chat.sender,
        timestamp: chat.updatedAt
      });
    }
  });

  const result = Array.from(uniqueConversations.values());

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Conversations fetched successfully"));
});

export const getUnreadMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.userRole; // 'buyer' or 'seller'

  // Fetch unread messages where the user is the recipient
  const filter = {
    read: false,
    [userRole]: userId,         // e.g., buyer: userId or seller: userId
    sender: { $ne: userRole },  // Not sent by themselves
  };

  const unreadMessages = await Chat.find(filter)
    .populate("listing", "price specifications")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, unreadMessages, "Unread messages fetched")
  );
});

export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.userRole;
  const { listingId, participantId } = req.params; // participantId = the other person in the chat

  const filter = {
    listing: listingId,
    [userRole]: userId,
    sender: { $ne: userRole }, // sent by the other person
    read: false,
  };

  const updated = await Chat.updateMany(filter, { $set: { read: true } });

  return res.status(200).json(
    new ApiResponse(200, updated, "Messages marked as read")
  );
});

export const fetchChatHistory = asyncHandler(async (req, res) => {
  const { listingId, buyerId } = req.params;
  const currentUserId = req.user._id;
  const currentUserRole = req.userRole;

  let buyer, seller;

  if (currentUserRole === "buyer") {
    buyer = currentUserId;
    seller = buyerId; // Here `buyerId` param actually represents sellerId when current user is buyer
  } else if (currentUserRole === "seller") {
    buyer = buyerId; // Correctly treat param as buyerId when current user is seller
    seller = currentUserId;
  } else {
    throw new ApiError(403, "Invalid user role");
  }

  const chatMessages = await Chat.find({
    listing: listingId,
    buyer,
    seller
  }).sort({ createdAt: 1 });

  // Identify messages not read by the current user
  const unreadMessages = chatMessages.filter(
    (msg) => !msg.read && msg.sender !== currentUserRole
  );
  const unreadIds = unreadMessages.map((msg) => msg._id);

  if (unreadIds.length > 0) {
    await Chat.updateMany(
      { _id: { $in: unreadIds } },
      { $set: { read: true } }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, chatMessages, "Chat history fetched and unread messages marked as read")
  );
});

