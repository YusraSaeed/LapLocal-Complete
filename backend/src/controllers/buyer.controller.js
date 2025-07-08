import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Buyer } from "../models/buyer.model.js";
import { fetchRecommendationsFromFastAPI } from "../utils/recommenderClient.js";

// const registerBuyer = asyncHandler(async (req, res) => {
//     // get data from form
//     // validate are required field are given
//     // check if buyers already has an account or not
//     // create obj
//     // save in mongodb
//     // remove password and refresh token
//     // return response

//     // get data from form
//     const {fullName, email, password} = req.body;

//     // checks if required fields are given
//     if (
//         [fullName, email, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     // checks if the buyer already exists
//     const existedBuyer = await Buyer.findOne({
//         $or: [{fullName}, {email}]
//     })

//     if(existedBuyer) {
//         throw new ApiError(409, "User Already Exists")
//     }

//     const accessToken = buyer.generateAccessToken();
//     const refreshToken = buyer.generateRefreshToken();

//     // Save refreshToken in DB
//     buyer.refreshToken = refreshToken;
//     await buyer.save({ validateBeforeSave: false });

//     // creating object
//     const buyer = await Buyer.create({
//         fullName,
//         email,
//         password
//     })

//     const buyerCreated = await Buyer.findById(buyer._id).select("-password -refreshToken" )

//     if(!buyerCreated) {
//         throw new ApiError(500, "Something went wrong while registering user")
//     }

//     // return response
//     return res.status(200).json(
//         new ApiResponse(200,buyerCreated, "User created Successfully")
//     )
// })

const registerBuyer = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate input
  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists
  const existedBuyer = await Buyer.findOne({
    $or: [{ fullName }, { email }]
  });

  if (existedBuyer) {
    throw new ApiError(409, "User already exists");
  }

  // ✅ Create user
  const buyer = await Buyer.create({ fullName, email, password });

  // ✅ Generate tokens
  const accessToken = buyer.generateAccessToken();
  const refreshToken = buyer.generateRefreshToken();

  // ✅ Save refresh token to DB
  buyer.refreshToken = refreshToken;
  await buyer.save({ validateBeforeSave: false });

  // ✅ Remove sensitive fields
  const buyerData = buyer.toObject();
  delete buyerData.password;
  delete buyerData.refreshToken;

  // ✅ Return response with tokens
  return res.status(200).json(
    new ApiResponse(200, {
      user: buyerData,
      accessToken,
      refreshToken
    }, "User registered successfully")
  );
});


const generateAccessAndRefreshTokens = async (buyerId) => {
    try {
        const buyer = await Buyer.findById(buyerId)
        const accessToken = buyer.generateAccessToken()
        const refreshToken = buyer.generateRefreshToken()

        buyer.refreshToken = refreshToken

        await buyer.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const loginBuyer = asyncHandler(async (req, res) => {
    // get data from form
    // check if all valid fields are given
    // check if the buyer exists
    // check if the password is correct
    // generate tokens
    // send cookies
    // if access token is expired, check RT and give another AT

    // form data
    const {email, password} = req.body

    // checking all fields
    if(!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    //checking if user exists
    const buyer = await Buyer.findOne({email})

    if(!buyer) {
        throw new ApiError(404, "User not found")
    }

    // verify password
    const isPasswordValid = await buyer.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Incorrect password")
    }

    // geneate token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(buyer._id)

    const loggedInBuyer = await Buyer.findById(buyer._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true, // send only over HTTPS
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
                user : loggedInBuyer,
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const oauthLogin = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized: No user found from passport");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const sanitizedUser = await Buyer.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // return res
    //     .status(200)
    //     .cookie("accessToken", accessToken, options)
    //     .cookie("refreshToken", refreshToken, options)
    //     .json(new ApiResponse(200, { user: sanitizedUser, accessToken, refreshToken }, "OAuth login successful"));

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    // Redirect to frontend dashboard
    // return res.redirect(`http://localhost:5173/buyer/dashboard`);
    return res.redirect(
      `http://localhost:5173/buyer/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not found in cookies");
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await Buyer.findById(decoded._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(403, "Refresh token is invalid or has been rotated");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed successfully"));

    } catch (error) {
        console.error("Error refreshing token:", error);
        throw new ApiError(403, "Invalid or expired refresh token");
    }
});


const logoutBuyer = asyncHandler(async(req, res) => {
    await Buyer.findByIdAndUpdate(
        req.user._id, 
        {
            $set : {
                refreshToken : undefined
            },
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
        sameSite: "Lax"
    }

    return res.
    status(200).
    clearCookie("accessToken", options).
    clearCookie("refreshToken", options).
    json(
        new ApiResponse(200, {}, "User Logged Out")
    )

})


const updateBuyerRecommendations = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  const { listingIds = [] } = req.body;

  // console.log("➡️ Entered updateBuyerRecommendations"); //done
  // console.log("📌 Buyer ID:", buyerId); //done
  // console.log("📦 Listing IDs from body:", listingIds);

  // Step 1: Fetch recommendations from FastAPI
  let recommendations;
  try {
    // console.log("🔁 Calling FastAPI for recommendations...");
    recommendations = await fetchRecommendationsFromFastAPI({
      buyerId,
      listingIds
    });
    // console.log("✅ Recommendations received from FastAPI:", recommendations);
  } catch (err) {
    // console.error("❌ Error contacting FastAPI:", err.message);
    throw new ApiError(500, "Failed to fetch recommendations from recommender system.");
  }

  // Step 2: Update buyer document
  const buyer = await Buyer.findByIdAndUpdate(
    buyerId,
    { recommendations },
    { new: true }
  ).populate("recommendations");

  if (!buyer) {
    // console.error("❌ Buyer not found for ID:", buyerId);
    throw new ApiError(404, "Buyer not found");
  }

  console.log("✅ Buyer recommendations updated successfully");

  return res.status(200).json(
    new ApiResponse(200, buyer.recommendations, "Recommendations generated and saved")
  );
});

const getBuyerRecommendations = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;

  const buyer = await Buyer.findById(buyerId)
    .populate({
      path: "recommendations",
      populate: [
        { path: "laptop", model: "Laptop" },
        { path: "seller", select: "name" } // ✅ include seller name here
      ]
    });

  if (!buyer) {
    throw new ApiError(404, "Buyer not found");
  }

  return res.status(200).json(
    new ApiResponse(200, buyer.recommendations, "Recommendations fetched")
  );
});

export const getCurrentBuyer = asyncHandler(async (req, res) => {
  const buyer = await Buyer.findById(req.user._id).select("-password -refreshToken");
  if (!buyer) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, buyer, "User fetched successfully"));
});


export {
    registerBuyer,
    loginBuyer,
    oauthLogin,
    refreshAccessToken,
    logoutBuyer,
    updateBuyerRecommendations,
    getBuyerRecommendations
}