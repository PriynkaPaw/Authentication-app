import twilio from "twilio";
import express from "express";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const route = express();
route.post("/num/send-otp", (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((message) => {
      req.session.otp = otp;
      req.session.phone = phone;
      req.session.save((err) => {
        if (err) {
          console.error("Failed to save session:", err);
          return res.status(500).send("Failed to send OTP");
        }
        res.status(200).send({ otp });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to send OTP");
    });
});

route.post("/num/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  console.log("phone: ", phone);
  console.log("otp", otp);
  console.log("req.session.otp: ", req.session);
  console.log("req.session.phone: ", req.session.phone);
  if (!req.session) {
    return res.status(500).send("Session not initialized");
  }
  if (phone === req.session.phone && otp === req.session.otp) {
    res.status(200).send("OTP verified");
  } else {
    res.status(400).send("OTP verification failed");
  }
});

export default route;
