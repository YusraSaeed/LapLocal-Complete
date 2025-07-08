import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { Router } from "express";
import {
    registerBuyer,
    loginBuyer,
    logoutBuyer,
    refreshAccessToken,
    getBuyerRecommendations,
    updateBuyerRecommendations,
    getCurrentBuyer
    
} from "../controllers/buyer.controller.js";


const router = Router();

router.route("/register").post(registerBuyer);
router.route("/login").post(loginBuyer);

// secured routes
router.route("/logout").post(verifyJWT, logoutBuyer)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/:buyerId/recommendations")
    .put(verifyJWT, updateBuyerRecommendations)
    .get(verifyJWT, getBuyerRecommendations);

router.route("/me").get(verifyJWT, getCurrentBuyer);



export default router;
