import route from "express";
import { RequestOTP, verifyOTP } from "../controllers/authController.js";

const router = route.Router();

router.post("/register", RequestOTP);

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOTP(email, otp);

  if (isValid) {
    res.status(200).json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP" });
  }
});

export default router;
