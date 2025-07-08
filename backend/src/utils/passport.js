import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Buyer } from "../models/buyer.model.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let buyer = await Buyer.findOne({ socialId: profile.id, provider: "google" });

        if (!buyer) {
            buyer = await Buyer.create({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                socialId: profile.id,
                provider: "google"
            });
        }

        done(null, buyer);

    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await Buyer.findById(id);
    done(null, user);
});
