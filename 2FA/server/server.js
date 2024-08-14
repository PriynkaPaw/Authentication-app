const express = require("express");
const cookieParser = require("cookie-parser");
const { JsonDB, Config } = require("node-json-db");
const qrcode = require("qrcode");
const { authenticator } = require("otplib");
const cors = require("cors");
const userDb = new JsonDB(new Config("users", true, true, "/"));
const bodyParser = require("body-parser");
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
// Login user
app.post("/login", async (req, res) => {
  try {
    const { id, password, code } = req.body;
    console.log("id,password,code", id, password, code);
    const user = await userDb.getData("/" + id);
    if (user && user.password === password) {
      if (user["2FA"].enabled) {
        if (!code) {
          return res.status(200).json({
            codeRequested: true,
          });
        }
        const verified = authenticator.check(code, user["2FA"].secret);
        if (!verified) {
          return res.status(400).json({
            error: "Invalid 2FA code",
          });
        }
      }

      return res.cookie("id", id, { httpOnly: true }).status(200).json({
        success: true,
      });
    }

    throw new Error("Invalid credentials");
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      error: err.message || "Invalid credentials",
    });
  }
});

// Generate QR Image
app.get("/qrImage", async (req, res) => {
  try {
    const { id } = req.cookies;
    const user = await userDb.getData("/" + id); //
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(id, "2FA", secret);
    const image = await qrcode.toDataURL(uri);

    user["2FA"].tempSecret = secret;
    await userDb.push("/" + id, user);
    return res.status(200).json({
      success: true,
      image,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Unable to generate QR code",
    });
  }
});

app.post("/set2FA", async (req, res) => {
  try {
    const { id } = req.cookies;
    const { code } = req.body;
    console.log("Received code: ", code);

    const user = await userDb.getData("/" + id);
    console.log("User data retrieved: ", user);
    const { tempSecret } = user["2FA"];
    console.log("Temporary secret: ", tempSecret);

    // Check the code with a possible time delta
    const delta = authenticator.checkDelta(code, tempSecret);
    console.log("Time delta: ", delta);

    if (delta === null) {
      return res.status(400).json({
        success: false,
        error: "Invalid 2FA code",
      });
    }

    // Update the user's 2FA status
    user["2FA"] = {
      enabled: true,
      secret: tempSecret,
    };
    await userDb.push("/" + id, user);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Failed to set 2FA",
    });
  }
});

// Check current session
app.get("/check", (req, res) => {
  const { id } = req.cookies;
  console.log("req.cookies: ", req.cookies);
  console.log("id: ", id);

  if (id) {
    return res.status(200).json({
      success: true,
      id,
    });
  }
  return res.status(200).json({
    success: false,
  });
});

// Logout user
app.get("/logout", async (req, res) => {
  res.clearCookie("id", { httpOnly: true });
  res.status(200).json({
    success: true,
  });
});

app.listen(3000, () => {
  console.log("App is listening on port: 3000");
});
