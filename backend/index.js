import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import otpRegisterRouter from "./routes/authRoutes.js";
import cors from "cors";
import googleAuthRouter from "./controllers/google-auth.js";
import facebookRouter from "./controllers/facebook-auth.js";
import phoneNumAuthController from "./controllers/phoneNumber-authController.js";
import registerRouter from "./routes/registerRoute.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/Authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: "thiismysecret.",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", otpRegisterRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/auth/facebook", facebookRouter);
app.use("/", phoneNumAuthController);
app.use("/", registerRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
