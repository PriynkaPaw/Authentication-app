import passport from "passport";
import express from "express"; // Corrected from 'route' to 'express'

const router = express.Router();

// Google authentication route
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/register/failed" }),
  (req, res) => {
    res.redirect("http://localhost:3000/signup");
  }
);

// Profile route
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/google");
  }
  res.json(req.user);
});

// register success route
router.get("/register/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

// register failed route
router.get("/register/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
});

export default router;

// import express from "express";
// import googleAuthController from "../controllers/google-auth.js";
// const router = express.Router();

// router("/", googleAuthController);

// export default router;
