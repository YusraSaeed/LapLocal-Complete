import crypto from "crypto";

export const generateResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString("hex"); // what we send via email
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    return { rawToken, hashedToken, expiry };
};

