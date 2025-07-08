import {
    registerAdmin,
    loginAdmin,
    getAllSellers,
    approveSeller,
    rejectSeller,
    getSellerById,
    deleteSellerById,
    logoutAdmin,
    getAdminDashboardStats
} from "../controllers/admin.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {authorizeRole} from "../middlewares/authorizeRole.middleware.js"

const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)

// Approve seller



router.use(verifyJWT, authorizeRole("admin"))

router.route("/sellers").get(getAllSellers)
router.route("/sellers/approve/:sellerId").patch(approveSeller);
router.route("/sellers/reject/:sellerId").patch(rejectSeller);
router.route("/sellers/:sellerId").get(getSellerById)
router.route("/sellers/:sellerId").delete(deleteSellerById);
router.post("/logout", logoutAdmin);
router.get("/dashboard-stats", getAdminDashboardStats);


export default router;
