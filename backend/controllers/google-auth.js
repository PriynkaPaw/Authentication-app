import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

const googleAuthDal = {
  registerWithGoogle: async (oauthUser) => {
    const isUserExists = await User.findOne({
      accountId: oauthUser.id,
      provider: oauthUser.provider,
    });
    console.log("isUserExists: ", isUserExists);

    if (isUserExists) {
      const failure = {
        message: "User already Registered.",
      };
      return { failure };
    }

    const user = new User({
      accountId: oauthUser.id,
      name: oauthUser.displayName,
      provider: oauthUser.provider,
      email: oauthUser.emails[0].value,
      photoURL: oauthUser.photos[0].value,
    });
    await user.save();
    const success = {
      message: "User Registered.",
    };
    return { success };
  },
};

let userProfile;

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GoogleClientID,
      clientSecret: process.env.GoogleClientSecret,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      userProfile = profile;
      try {
        const result = await googleAuthDal.registerWithGoogle(profile);
        if (result.failure) {
          console.log(result.failure.message);
        } else {
          console.log(result.success.message);
        }
        const user = await User.findOne({
          accountId: profile.id,
          provider: profile.provider,
        });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

router.get("/success", async (req, res) => {
  console.log("res: ", res);

  res.render("success", { user: userProfile });
});

router.get("/error", (req, res) => res.send("Error logging in via Google.."));

router.get("/signout", (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(400).send({ message: "Failed to sign out user" });
      }
      console.log("Session destroyed.");
      res.redirect("http://localhost:3000/");
    });
  } catch (err) {
    res.status(400).send({ message: "Failed to sign out user" });
  }
});

export default router;
