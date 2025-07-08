import passport from "passport";
import { Router } from "express";
import { oauthLogin } from "../controllers/buyer.controller.js";
import { changePassword, forgotPassword, resetPassword} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/google").get(
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "consent" })
);

router.route("/google/callback").get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    oauthLogin
);

router.route("/change-password").post(verifyJWT, changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;




// 