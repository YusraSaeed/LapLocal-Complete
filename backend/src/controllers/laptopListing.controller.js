import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Laptop } from "../models/laptop.model.js";
import { Buyer } from "../models/buyer.model.js";
import { LaptopListing } from "../models/laptopListing.model.js";
import { v2 as cloudinary } from "cloudinary";
import { updateBuyerRecommendations } from "./buyer.controller.js";
import { io, onlineUsers } from "../app.js"

import mongoose from "mongoose";
export const addLaptopListing = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;

    const {
        name,
        brand,
        price,
        condition,
        quantityAvailable
    } = req.body;

    const specifications = {};
    for (const key in req.body) {
        if (key.startsWith("specifications.")) {
            const specKey = key.split("specifications.")[1];
            specifications[specKey] = req.body[key];
        }
    }

    if (
        [name, brand, price, condition, quantityAvailable].some(
            (field) => !field || field.trim?.() === ""
        ) || Object.keys(specifications).length === 0
    ) {
        throw new ApiError(400, "All fields including specifications are required");
    }

    console.log(req.files);
    
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    if (req.files.length > 5) {
  throw new ApiError(400, "You can upload a maximum of 5 images.");
}

    const imageUploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path)
    );
    const uploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = uploadResults.map((file) => file.secure_url);

    let laptop = await Laptop.findOne({ name: name.trim(), brand: brand.trim() });
    if (!laptop) {
        laptop = await Laptop.create({ name, brand });
    }

    const listing = await LaptopListing.create({
        laptop: laptop._id,
        seller: sellerId,
        price,
        specifications,
        condition,
        quantityAvailable,
        images: imageUrls,
        isAvailable: true,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, listing, "Laptop listing created successfully"));
});

export const getSellerInventory = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;

    const listings = await LaptopListing.find({ seller: sellerId })
        .populate("laptop") // optional: populate laptop details
        .sort({ createdAt: -1 })
        .limit(12);

    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Seller inventory fetched successfully"));
});

export const getListingById = asyncHandler(async (req, res) => {
    const sellerId = req.user?._id
    const {listingId} = req.params

    const listing = await LaptopListing.findOne({
        _id: listingId,
        seller : sellerId
    }).populate("laptop")

    if(!listing) {
        throw new ApiError(404, "Listing not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched"))
})


export const getSellerFullInventory = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const listings = await LaptopListing.find({ seller: sellerId })
    .populate({
      path: "laptop",
      select: "name brand",
    })
    .select("laptop createdAt images price condition specifications") // ✅ include everything you show in table
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Optimized full seller inventory"));
});

const extractPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0];
    return `LapLocal/${publicId}`;
};


export const updateLaptopListing = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { listingId } = req.params;

  const listing = await LaptopListing.findOne({
    _id: listingId,
    seller: sellerId
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found or unauthorized");
  }

  // ✅ Update laptop name if provided
  const { productName, price, condition, quantityAvailable } = req.body;

  if (productName) {
    await Laptop.findByIdAndUpdate(listing.laptop, { name: productName });
  }

  if (price) listing.price = price;
  if (condition) listing.condition = condition;
  if (quantityAvailable) listing.quantityAvailable = quantityAvailable;

  // ✅ Correctly update MAP type:
  const specifications = {};
  for (const key in req.body) {
    if (key.startsWith("specifications.")) {
      const specKey = key.split("specifications.")[1];
      specifications[specKey] = req.body[key];
    }
  }

  for (const [key, value] of Object.entries(specifications)) {
    listing.specifications.set(key, value);
  }

  // ✅ Replace images if any:
  if (req.files && req.files.length > 0) {
    const deletePromises = listing.images.map((url) => {
      const publicId = extractPublicIdFromUrl(url);
      return cloudinary.uploader.destroy(publicId);
    });
    await Promise.all(deletePromises);

    const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((res) => res.secure_url);
    listing.images = imageUrls;
  }

  await listing.save();

  const populated = await listing.populate("laptop");

  return res.status(200).json(new ApiResponse(200, populated, "Listing updated successfully"));
});



export const deleteLaptopListing = asyncHandler(async (req, res) => {
    const { listingId } = req.params;

    const listing = await LaptopListing.findById(listingId);

    if (!listing) {
        throw new ApiError(404, "Laptop listing not found");
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this listing");
    }

    const deletionPromises = listing.images.map((url) =>
        cloudinary.uploader.destroy(extractPublicIdFromUrl(url))
    );
    await Promise.all(deletionPromises);

    await LaptopListing.findByIdAndDelete(listingId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Laptop listing deleted successfully"));
});


export const searchLaptopByName = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  console.log("🔍 Received keyword:", keyword); //check

  if (!keyword || keyword.trim() === "") {
    throw new ApiError(400, "Search keyword is required");
  }

  const searchRegex = new RegExp(keyword, "i");

  const laptops = await Laptop.find({ name: searchRegex });

  console.log(`✅ Found ${laptops.length} matching laptops.`); //done

  const listings = await LaptopListing.find({
    laptop: { $in: laptops.map((l) => l._id) },
    isAvailable: true,
  })
    .populate("laptop")
    .populate("seller", "-password -refreshToken");

  console.log(`✅ Found ${listings.length} available listings.`); //done

  if (req.user && req.userRole === "buyer") {
    const words = keyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 1);

    const uniqueWords = [...new Set(words)];

    const buyer = await Buyer.findById(req.user._id);
    const existingKeywords = new Set(
      buyer.recentSearches.map((entry) => entry.keyword.toLowerCase())
    );

    const newSearchEntries = uniqueWords
      .filter((kw) => !existingKeywords.has(kw))
      .map((word) => ({
        keyword: word,
        timestamp: new Date(),
      }));

    if (newSearchEntries.length > 0) {
      await Buyer.findByIdAndUpdate(req.user._id, {
        $push: { recentSearches: { $each: newSearchEntries } },
      });
    } else {
      console.log("ℹ️ No new keywords to store.");
    }
  }

//   await updateBuyerRecommendations(
//   { params: { buyerId: req.user._id }, body: {} },
//   { status: () => ({ json: () => {} }) }
// );

  await updateBuyerRecommendations(
  {
    params: { buyerId: req.user._id },
    body: {
      listingIds: listings.map((l) => l._id.toString())  // ✅ Ensure clean string IDs
    }
  },
  { status: () => ({ json: () => {} }) }
);

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Search results"));
});

// controllers/buyer/applyFilters.js

export const applyFilters = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { filters } = req.body;

    console.log("📥 Received applyFilters request");
    console.log("🔐 Authenticated Buyer ID:", buyerId);
    console.log("🧩 Filters Received:", filters);

    if (!filters || typeof filters !== "object") {
      return res.status(400).json({ message: "No valid filters provided" });
    }


    await Buyer.findByIdAndUpdate(buyerId, {
      $push: {
        appliedFilters: {
          $each: [
            {
              filters,
              timestamp: new Date(),
            },
          ],
          $slice: -10,
        },
      },
    }

    
  
);

await updateBuyerRecommendations(
  { params: { buyerId }, body: {} },
  { status: () => ({ json: () => {} }) }
);

    res.status(200).json({ message: "Filters saved successfully" });
  } catch (err) {
    console.error("❌ Error saving filters:", err);
    res.status(500).json({ message: "Failed to save filters" });
  }
};






// export const getLaptopListingById = asyncHandler(async (req, res) => {
//   const { listingId } = req.params;

//   const listing = await LaptopListing.findById(listingId)
//     .populate("laptop")
//     .populate("seller", "fullName shopName shopAddress phone");

//   if (!listing) {
//     throw new ApiError(404, "Laptop listing not found");
//   }

//   if (req.user && req.userRole === "buyer") {
//     const buyer = await Buyer.findById(req.user._id);
//     const alreadyViewed = buyer.viewedListings.some(
//       (entry) => entry.listing.toString() === listing._id.toString()
//     );

//     if (!alreadyViewed) {
//       await Buyer.findByIdAndUpdate(req.user._id, {
//         $push: {
//           viewedListings: {
//             listing: listing._id,
//             timestamp: new Date(),
//           },
//         },
//       });
//     } else {
//       console.log("🔁 Listing already viewed:", listing._id);
//     }
//   }

//   await updateBuyerRecommendations(
//   { params: { buyerId: req.user._id }, body: { listingIds: [listing._id] } },
//   { status: () => ({ json: () => {} }) }
// );

//   const sellerId = listing.seller._id.toString();
//   const sellerSocket = onlineUsers.get(sellerId);

//   if (sellerSocket) {
//     io.to(sellerSocket.socketId).emit("listing_viewed", {
//       listingId: listing._id,
//       buyerId: req.user._id,
//       timestamp: new Date(),
//     });
//     console.log(`📢 Notified seller ${sellerId} about viewed listing`);
//   }

//   return res.status(200).json(
//     new ApiResponse(200, listing, "Laptop listing details")
//   );
// });


export const compareLaptopListings = asyncHandler(async (req, res) => {
  const { listingIds } = req.body;

  if (!Array.isArray(listingIds) || listingIds.length !== 2) {
    throw new ApiError(400, "Exactly two listing IDs are required for comparison");
  }

  const listings = await LaptopListing.find({ _id: { $in: listingIds } })
    .populate("laptop")
    .populate("seller", "fullName shopName email phone shopAddress");

  if (listings.length !== 2) {
    throw new ApiError(404, "One or both listings not found");
  }

  return res.status(200).json(new ApiResponse(200, listings, "Laptop listings for comparison"));
});

export const searchLaptopListings = asyncHandler(async (req, res) => {
  const { query, sellerId } = req.query;

  if (!query) throw new ApiError(400, "Search query required");

  const filter = {
    title: { $regex: query, $options: "i" }
  };

  if (sellerId && mongoose.Types.ObjectId.isValid(sellerId)) {
    filter.seller = new mongoose.Types.ObjectId(sellerId);
  }

  const listings = await LaptopListing.find(filter)
    .limit(10)
    .populate("laptop")
    .populate("seller", "fullName");

  res.status(200).json(new ApiResponse(200, listings, "Matching listings"));
});



import { Seller } from "../models/seller.model.js";

export const rateSeller = asyncHandler(async (req, res) => {
    const buyerId = req.user._id;
    const { sellerId, listingId, rating, review } = req.body;

    if (!sellerId || !listingId || !rating) {
        throw new ApiError(400, "sellerId, listingId, and rating are required");
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    const listingExists = await LaptopListing.findOne({
        _id: listingId,
        seller: sellerId
    });
    if (!listingExists) {
        throw new ApiError(404, "Listing not found for this seller");
    }

    const existing = seller.ratings.find(
        (r) =>
        r.buyer.toString() === buyerId.toString() &&
        r.listing.toString() === listingId.toString()
    );

    if (existing) {
        existing.rating = rating;
        existing.review = review;
    } else {
        seller.ratings.push({
        buyer: buyerId,
        listing: listingId,
        rating,
        review
        });
    }

    const totalRatings = seller.ratings.length;
    const avg =
        seller.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    seller.averageRating = parseFloat(avg.toFixed(2));
    await seller.save();

    return res.status(200).json(
        new ApiResponse(200, seller.averageRating, "Rating submitted successfully")
    );
});


export const getSellerRatings = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId)
        .populate("ratings.buyer", "fullName")
        .populate("ratings.listing", "laptop price");

    if (!seller) {
        throw new ApiError(404, "Seller not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, seller.ratings, "Seller ratings fetched successfully"));
});

export const getLaptopListingsInBulk = asyncHandler(async (req, res) => {
  const { listingIds } = req.body;

  if (!Array.isArray(listingIds) || listingIds.length === 0) {
    throw new ApiError(400, "Invalid or missing listingIds");
  }

  const listings = await LaptopListing.find({
    _id: { $in: listingIds },
    isAvailable: true,
  })
    .populate("laptop")
    .populate("seller", "fullName shopName shopAddress");

  return res.status(200).json(
    new ApiResponse(200, listings, "Bulk listings fetched successfully")
  );
});

export const getListingsBySellerId = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const listings = await LaptopListing.find({ seller: sellerId })
    .populate("laptop", "name brand")
    .select("title laptop seller"); // lightweight

  if (!listings || listings.length === 0) {
    throw new ApiError(404, "No listings found for this seller");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Listings from this seller"));
});


export const getFilteredListings = async (req, res) => {
  try {
    const { filters } = req.body;

    const matchStage = [];

    // Preprocess filters
    if (filters.priceRange) {
      const min = filters.priceRange.min || 0;
      const max = filters.priceRange.max || 10000000;
      matchStage.push({
        $expr: {
          $and: [
            { $gte: [{ $toInt: { $replaceAll: { input: "$price", find: ",", replacement: "" } } }, min] },
            { $lte: [{ $toInt: { $replaceAll: { input: "$price", find: ",", replacement: "" } } }, max] },
          ],
        },
      });
    }

    if (filters.ram?.length) {
      matchStage.push({
        $expr: {
          $in: [
            { $toLower: "$specifications.ram" },
            filters.ram.map((r) => r.toLowerCase())
          ]
        }
      });
    }

    if (filters.storage?.length) {
      matchStage.push({
        $expr: {
          $in: [
            { $toLower: "$specifications.storage" },
            filters.storage.map((s) => s.toLowerCase())
          ]
        }
      });
    }

    // Aggregate pipeline with $lookup to join laptop data
    const results = await LaptopListing.aggregate([
      {
        $lookup: {
          from: "laptops", // Collection name
          localField: "laptop",
          foreignField: "_id",
          as: "laptop"
        }
      },
      { $unwind: "$laptop" },
      ...(filters.brand?.length
        ? [{
            $match: {
              "laptop.brand": { $in: filters.brand },
            }
          }]
        : []),
      ...(matchStage.length > 0 ? [{ $match: { $and: matchStage } }] : []),
    ]);

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error in optimized filter-only controller:", err);
    res.status(500).json({ message: "Failed to fetch filtered listings" });
  }
};



export const getLaptopListingById = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const listing = await LaptopListing.findById(listingId)
    .populate("laptop")
    .populate("seller", "fullName shopName shopAddress phone verificationStatus");


  if (!listing) {
    throw new ApiError(404, "Laptop listing not found");
  }

  if (req.user && req.userRole === "buyer") {
    const buyerId = req.user._id;
    const listingObjectId = listing._id;

    // Always record the view (even if it's a duplicate)
    await Buyer.findByIdAndUpdate(buyerId, {
      $push: {
        viewedListings: {
          listing: listingObjectId,
          timestamp: new Date(),
        },
      },
    });

    // console.log(`👁️ Buyer ${buyerId} viewed listing ${listingObjectId}`);


    // Update buyer recommendations
    await updateBuyerRecommendations(
      { params: { buyerId }, body: { listingIds: [listingObjectId] } },
      { status: () => ({ json: () => {} }) }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, listing, "Laptop listing details")
  );
});



import { SellerViewedListing } from "../models/sellerViewedListings.model.js"; // 👈 NEW
// export const getLaptopListingById = asyncHandler(async (req, res) => {
//   const { listingId } = req.params;

//   const listing = await LaptopListing.findById(listingId)
//     .populate("laptop")
//     .populate("seller", "fullName shopName shopAddress phone");

//   if (!listing) {
//     throw new ApiError(404, "Laptop listing not found");
//   }

//   if (req.user && req.userRole === "buyer") {
//     const buyerId = req.user._id;
//     const listingObjectId = listing._id;
//     const sellerId = listing.seller._id.toString();

//     // ✅ 1. Track buyer view in their profile
//     await Buyer.findByIdAndUpdate(buyerId, {
//       $push: {
//         viewedListings: {
//           listing: listingObjectId,
//           timestamp: new Date(),
//         },
//       },
//     });

//     // ✅ 2. Save view for seller analytics
//     await SellerViewedListing.create({
//       seller: sellerId,
//       listing: listingObjectId,
//       buyer: buyerId,
//       viewedAt: new Date(),
//     });

//     // ✅ 3. Emit real-time notification to seller (if connected)
//     const sellerSocket = onlineUsers.get(sellerId);
//     if (sellerSocket) {
//       io.to(sellerSocket.socketId).emit("listing_viewed", {
//         listingId: listingObjectId,
//         buyerId,
//         timestamp: new Date(),
//       });
//       console.log(`📢 Notified seller ${sellerId} — viewed by buyer ${buyerId}`);
//     } else {
//       console.log(`⚠️ Seller ${sellerId} not connected`);
//     }

//     // ✅ 4. Update buyer's recommendation model
//     await updateBuyerRecommendations(
//       { params: { buyerId }, body: { listingIds: [listingObjectId] } },
//       { status: () => ({ json: () => {} }) } // dummy response object
//     );
//   }

//   return res.status(200).json(
//     new ApiResponse(200, listing, "Laptop listing details")
//   );
// });

