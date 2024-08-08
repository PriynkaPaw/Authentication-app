import OTP from "../models/OTP.js";
import sendEmail from "../utils/mailer.js";

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

async function RequestOTP(req, res) {
  const { email } = req.body;

  try {
    const otpCode = generateOTP();

    await sendEmail(email, otpCode);

    await createOTP(email, otpCode);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error in OTP process:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

async function createOTP(email, otpCode) {
  const ThreeMinutesLater = new Date(Date.now() + 3 * 60 * 1000);
  try {
    const existingOTP = await OTP.findOne({ email });

    if (existingOTP) {
      existingOTP.otp = otpCode;
      existingOTP.expiresAt = ThreeMinutesLater;
      const updatedOTP = await existingOTP.save();

      console.log("OTP updated successfully:", updatedOTP);
      return updatedOTP;
    } else {
      const newOTP = new OTP({
        email,
        otp: otpCode,
        expiresAt: ThreeMinutesLater,
      });
      await newOTP.save();

      console.log("OTP created successfully:", newOTP);
      return newOTP;
    }
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
}

// Function to verify the OTP
async function verifyOTP(email, otpCode) {
  try {
    const otpEntry = await OTP.findOne({
      email,
      otp: otpCode,
      expiresAt: { $gt: new Date() },
    });

    if (otpEntry) {
      console.log("OTP verified successfully:", otpEntry);
      return true;
    } else {
      console.log("OTP verification failed or expired.");
      return false;
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

export { RequestOTP, createOTP, verifyOTP };
