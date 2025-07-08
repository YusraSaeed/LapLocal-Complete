import {
    registerSeller, 
    loginSeller,
    logoutSeller,
    refreshAccessToken,
    getSellerById,
    updateSellerProfile,
    getSellerViewedListings,
    markViewedListingsAsRead
} from "../controllers/seller.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerSeller)
router.route("/login").post(loginSeller)
router.route("/logout").post(verifyJWT, logoutSeller)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/getSeller/:sellerId").get(getSellerById)
router.put("/update/:sellerId",
  verifyJWT, // ✅ secure it so only logged-in seller can update self
  updateSellerProfile
);
router.get("/viewed-listings", verifyJWT, getSellerViewedListings);
router.patch("/viewed-listings/mark-read", verifyJWT, markViewedListingsAsRead);


export default router;