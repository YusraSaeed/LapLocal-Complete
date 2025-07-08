// src/utils/callChatbot.js
import dotenv from "dotenv";
dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL;

if (!FASTAPI_URL) {
  console.error("❌ FASTAPI_URL is not defined in .env");
  throw new Error("Missing FASTAPI_URL in environment");
}

export const callChatbotAPI = async (question, user_id) => {
  console.log("➡️ Calling FastAPI with:", { question, user_id });

  try {
    const response = await fetch(`${FASTAPI_URL}/chatbot/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        stream: false,
        user_id
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ FastAPI error:", data);
      throw new Error(data?.detail || "FastAPI error");
    }

    return data.response;
  } catch (err) {
    console.error("❌ Utility function error:", err.message);
    throw err;
  }
};
