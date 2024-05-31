import mongoose from "mongoose";

const userInfo = new mongoose.Schema({
  access_token: String,
  refersh_token: String,
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});
const history = new mongoose.Schema({
  event: String,
  executedAt: {
    type: Date,
    default: Date.now(),
  },
});
export const History = mongoose.model("History", history);
export const userInfoModel = mongoose.model("userInforModel", userInfo);
