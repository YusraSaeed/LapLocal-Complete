// src/controllers/chatbot.controller.js
import { callChatbotAPI } from "../utils/callChatbot.js";

export const handleChatRequest = async (req, res) => {
  try {
    const { question, user_id } = req.body;

    if (!question || !user_id) {
      return res.status(400).json({ error: "Missing question or user_id" });
    }

    console.log("✅ Received:", { question, user_id });

    const botResponse = await callChatbotAPI(question, user_id);

    return res.json({ response: botResponse });
  } catch (error) {
    console.error("❌ Chatbot controller error:", error.message);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};
