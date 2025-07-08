export const generateAccessAndRefreshTokens = async (buyerId) => {
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