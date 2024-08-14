import User from "../models/User.js";

export const registerController = async (req, res) => {
  const { email } = req.body;
  console.log("email: ", email);
  console.log("req.body", req.body);
  const isUserExists = await User.findOne({
    email,
  });
  console.log("isUserExists: ", isUserExists);

  if (isUserExists) {
    return res.send({ massage: "User already Registered." });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.passport,
    phone: req.body.phone,
  });
  await user.save();

  return res.status(200).send({ massage: "User Created successfully" });
};

export const loginController = async (req, res) => {
  console.log("Req.body", req.body);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(400).send("Wrong password");
  }
};
