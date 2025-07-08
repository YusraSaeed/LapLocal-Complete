import express from "express";
import { 
    addLaptopListing, 
    getSellerInventory,
    getListingById,
    updateLaptopListing,
    deleteLaptopListing,
    searchLaptopByName,
    
    getLaptopListingById,
    compareLaptopListings,
    rateSeller,
    getSellerRatings,
    getSellerFullInventory,
    getLaptopListingsInBulk,
    searchLaptopListings,
    getListingsBySellerId,
    applyFilters,
    getFilteredListings,
    
} from "../controllers/laptopListing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { LaptopListing } from "../models/laptopListing.model.js";

const router = express.Router();

router.route("/listing").post(
    verifyJWT,
    authorizeRole("seller"),
    uploadImages, // Accept up to 5 images under the field name 'images'
    addLaptopListing
);

router.route("/inventory").get(
    verifyJWT, 
    authorizeRole("seller"), 
    getSellerInventory);

router.route("/inventory/all").get(
    verifyJWT, 
    authorizeRole("seller"), 
    getSellerFullInventory);

    // seller
router.route("/listing/:listingId").get(
    verifyJWT, 
    authorizeRole("seller"), 
    getListingById);
    
router.route("/listing/:listingId")
    .patch(
    verifyJWT,
    authorizeRole("seller"),
    uploadImages,
    updateLaptopListing
    );

router.route("/listing/:listingId")
    .delete(
        verifyJWT, 
        authorizeRole("seller"), 
        deleteLaptopListing);

router.route("/rate-seller").post(
    verifyJWT,
    authorizeRole("buyer"),
    rateSeller
);



router.route("/:sellerId/ratings").get(getSellerRatings);

// router.route("/search").get(searchLaptopByName)
router.route("/search").get(verifyJWT, searchLaptopByName);

router.route("/getlisting/:listingId").get(verifyJWT,getLaptopListingById)
router.route("/compare").post(compareLaptopListings)
router.post('/bulk', getLaptopListingsInBulk);
router.get("/searchLaptop", searchLaptopListings);
router.post("/apply-filters", verifyJWT, applyFilters);
router.post("/filter-only", verifyJWT, getFilteredListings);




router.get("/getlistings/by-seller/:sellerId", getListingsBySellerId);


export default router;

