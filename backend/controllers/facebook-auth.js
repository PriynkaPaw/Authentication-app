import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";
import express from "express";
const router = express.Router();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FaceBookClientId,
      clientSecret: process.env.FaceBookClientSecret,
      callbackURL: "http://localhost:3000/signup",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("Adding new facebook user to DB..");

      try {
        let user = await User.findOne({
          accountId: profile.id,
          provider: "facebook",
        });
        console.log("getting data", user);
        if (!user) {
          console.log("Adding new facebook user to DB..");
          user = new User({
            accountId: profile.id,
            name: profile.displayName,
            provider: profile.provider,
          });
          await user.save();
          return cb(null, user);
        } else {
          console.log("Facebook User already exists in DB..");
          return cb(null, user);
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook/error",
  }),
  (req, res) => {
    console.log("/auth/facebook/success");

    res.redirect("/auth/facebook/success");
  }
);

router.get("/success", (req, res) => {
  if (req.user) {
    const userInfo = {
      id: req.user.id,
      displayName: req.user.displayName,
      provider: req.user.provider,
    };
    res.json({
      message: "Successfully authenticated via Facebook",
      user: userInfo,
    });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

router.get("/error", (req, res) =>
  res.status(400).json({ error: "Error logging in via Facebook" })
);

router.get("/signout", (req, res) => {
  try {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to sign out fb user" });
      }
      res.json({ message: "Successfully signed out" });
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to sign out fb user" });
  }
});

export default router;
