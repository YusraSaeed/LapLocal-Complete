import express from "express";
import { 
    sendMessage, 
    fetchChatHistory, 
    getUserConversations,
    getUnreadMessages,
    markMessagesAsRead
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", verifyJWT, sendMessage);
// router.get("/history/:listingId/:buyerId", verifyJWT, getChatHistory);
router.route("/inbox").get(verifyJWT, getUserConversations);
router.get("/history/:listingId/:buyerId", verifyJWT, fetchChatHistory);


router.get("/unread", verifyJWT, getUnreadMessages);
router.patch("/mark-read/:listingId/:participantId", verifyJWT, markMessagesAsRead);



export default router;
