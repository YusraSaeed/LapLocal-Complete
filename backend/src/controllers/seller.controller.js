import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Seller } from "../models/seller.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { io } from "../app.js";

const registerSeller = asyncHandler(async (req, res) => {
  const { fullName, email, password, shopName, shopNumber, shopAddress, phone } = req.body;

  if ([fullName, email, password, shopName, shopNumber, shopAddress, phone].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedSeller = await Seller.findOne({
    $or: [{ email }, { shopName }, { shopNumber }, { shopAddress }],
  });

  if (existedSeller) {
    throw new ApiError(409, "User already exists");
  }

  const seller = await Seller.create({
    fullName,
    email,
    password,
    shopName,
    shopNumber,
    shopAddress,
    phone,
  });

  const accessToken = seller.generateAccessToken();
  const refreshToken = seller.generateRefreshToken();
  seller.refreshToken = refreshToken;
  await seller.save({ validateBeforeSave: false });

  const sellerCreated = await Seller.findById(seller._id).select("-password -refreshToken");
  if (!sellerCreated) {
    throw new ApiError(500, "Something went wrong");
  }

  // ✅ Emit socket event to admins
  io.emit("new_seller_registered", {
    fullName: sellerCreated.fullName,
    shopName: sellerCreated.shopName,
    shopAddress: sellerCreated.shopAddress,
    email: sellerCreated.email,
  });

  return res.status(200).json(
    new ApiResponse(200, {
      user: sellerCreated,
      accessToken,
      refreshToken,
    }, "User registered successfully")
  );
});

// const registerSeller = asyncHandler(async (req, res) => {
//     // get data from form
//     // check if all necessary fields are given
//     // check if the user exists
//     // create a mongodb user
//     // return the user back

//     // get data
//     const {fullName, email, password, shopName, shopNumber, shopAddress, phone} = req.body;

//     // validation
//     if(
//         [fullName, email, password, shopName, shopNumber, shopAddress, phone].some((field) => (
//             field?.trim() == ""
//     )) 
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     // check if seller exists
//     const existedSeller = await Seller.findOne({
//         $or: [{ email }, { shopName }, { shopNumber }, { shopAddress }]
//     })

//     if(existedSeller) {
//         throw new ApiError(409, "User already exists")
//     }

//     // create object
//     const seller = await Seller.create({
//         fullName,
//         email,
//         password,
//         shopName,
//         shopNumber,
//         shopAddress,
//         phone,
//     })    
//       // ✅ Generate tokens
//       const accessToken = seller.generateAccessToken();
//       const refreshToken = seller.generateRefreshToken();
    
//       // ✅ Save refresh token to DB
//       seller.refreshToken = refreshToken;
//       await seller.save({ validateBeforeSave: false });

//     // return user
//     const sellerCreated = await Seller.findById(seller._id).select("-password -refreshToken")

//     if(!sellerCreated) {
//         throw new ApiError(500, "Something went wrong")
//     }

//     // return res.status(200).
//     // json(new ApiResponse(200, sellerCreated, "New Seller registered successfully"))
//     // new ApiResponse(200, {
//     //       user: sellerCreated,
//     //       accessToken,
//     //       refreshToken
//     //     }, "User registered successfully")
//     return res.status(200).json(
//   new ApiResponse(200, {
//     user: sellerCreated,
//     accessToken,
//     refreshToken
//   }, "User registered successfully")
// );

// });

const generateAccessAndRefreshTokens = async (sellerId) => {
    try {
        const seller = await Seller.findById(sellerId)
        const accessToken = seller.generateAccessToken()
        const refreshToken = seller.generateRefreshToken()

        seller.refreshToken = refreshToken
        await seller.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch(error) {
        throw new ApiError(500, "Something went wrong while generating tokens")

    }
}

const loginSeller = asyncHandler(async (req, res) => {
    // get data from form
    // check if all fields are given
    // check if user exists
    // check if password matches
    // generate tokens
    // send cookies
    // if AT is expired check RT and regenerate AT

    const {email, password} = req.body
    
    // validation
    if(
        [email, password].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user exists
    const seller = await Seller.findOne({ email })
    if (!seller) {
        throw new ApiError(404, "User not found")
    }

    // check if password matches
    const isPasswordValid = await seller.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(seller._id)

    const loggedInSeller= await Seller.findById(seller._id).select("-password -refreshToken")
    
    // send cookies 
    const options = {
        httpOnly: true,
        secure:process.env.NODE_ENV,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: "Lax"
    };
    

    return res.
    status(200).
    cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInSeller,
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not found in cookies");
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await Seller.findById(decoded._id)

    if(!user || incomingRefreshToken != user.refreshToken) {
        throw new ApiError(403, "Refresh token is invalid or has been rotated");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const options = {
        httpOnly : true,
        secure : true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res.
    status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {accessToken, refreshToken}, "Tokens refreshed successfully"))

})




const logoutSeller = asyncHandler(async (req, res) => {
  await Seller.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 0, // ✅ Expire immediately
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const getSellerById = asyncHandler(async (req, res) => {
    const {sellerId} = req.params

    const seller = await Seller.findById(sellerId)
    .select("-password -refreshToken")
    // .populate({
    //     path: "inventory",
    //     // populate: {
    //     //     path: "laptop", // assuming LaptopListing references a Laptop
    //     //     model: "Laptop"
    //     // }
    // });

    if(!seller) {
        throw new ApiError(404, "Seller not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, seller, 'Seller found'))
})

const updateSellerProfile = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const updates = req.body;

  // For security: prevent changing email or password here if you want separate flows.
  const forbiddenFields = ["password", "refreshToken"];
  forbiddenFields.forEach((field) => {
    if (updates[field] !== undefined) {
      delete updates[field];
    }
  });

  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { $set: updates },
    { new: true, runValidators: true, select: "-password -refreshToken" }
  );

  if (!updatedSeller) {
    throw new ApiError(404, "Seller not found or update failed");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedSeller, "Seller profile updated successfully")
  );
});

import { SellerViewedListing } from "../models/sellerViewedListings.model.js";


export const getSellerViewedListings = asyncHandler(async (req, res) => {
  const sellerId = req.user._id; // validated by verifyJWT middleware

  const views = await SellerViewedListing.find({ seller: sellerId })
    .populate("listing", "laptop price")
    .populate("buyer", "fullName email") // adjust fields as needed
    .sort({ viewedAt: -1 });

  res.status(200).json(new ApiResponse(200, views, "Viewed listings for seller"));
});

// seller.controller.js
export const markViewedListingsAsRead = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  await SellerViewedListing.updateMany(
    { seller: sellerId, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json(new ApiResponse(200, null, "Marked as read"));
});






export {
    registerSeller,
    loginSeller,
    refreshAccessToken,
    logoutSeller,
    getSellerById,
    updateSellerProfile
}