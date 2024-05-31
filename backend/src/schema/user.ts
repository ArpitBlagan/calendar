import mongoose from "mongoose";

const userInfo = new mongoose.Schema({
  access_token: String,
  refersh_token: String,
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});
export const userInfoModel = mongoose.model("userInforModel", userInfo);
