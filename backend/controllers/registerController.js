import User from "../models/User.js";

const registerController = async (req, res) => {
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

export default registerController;
