// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   email: String,
//   name: String,
//   picture: String,
//   otp: String,
//   otpExpiry: Date,
//   verified: { type: Boolean, default: false },
// });

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    //accountId can be google Id, facebook Id, github Id .
    accountId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    provider: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
