"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userInfo = new mongoose_1.default.Schema({
    access_token: String,
    refersh_token: String,
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.userInfoModel = mongoose_1.default.model("userInforModel", userInfo);
