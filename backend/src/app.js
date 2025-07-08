import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))

app.use(express.json({
    'limit' : '16kb'
}))

app.use(express.urlencoded({
    extended:true,
}))

app.use(cookieParser())

// Set up HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // update with frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store active users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Register user ID with socket
  socket.on("register", ({ userId, role }) => {
    onlineUsers.set(userId, { socketId: socket.id, role });
    console.log(`✅ Registered ${role}: ${userId}`);
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (let [userId, info] of onlineUsers.entries()) {
      if (info.socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});


import session from "express-session";
import passport from "passport";
import "./utils/passport.js";

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

import compression from "compression"; // in your server setup
app.use(compression());


import buyerRoutes from "./routes/buyer.routes.js";
import authRoutes from "./routes/auth.routes.js";
import sellerRoutes from "./routes/seller.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import listingRoutes from "./routes/laptopListing.routes.js"
import chatRoutes from "./routes/chats.routes.js"
import chatbotRoutes from "./routes/chatbot.routes.js"

app.use("/api/v1/buyers", buyerRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/sellers", sellerRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/laptop-listing", listingRoutes)
app.use("/api/v1/chats", chatRoutes)
app.use("/api/v1/chatbot", chatbotRoutes)

export {app, io, onlineUsers}
export default server;
