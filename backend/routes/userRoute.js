import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createChannel,
  getChannelData,
  getCurrentUser,
  toggleSubscribe,
  updateChannel,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.get("/getuser", isAuth, getCurrentUser);
userRouter.post(
  "/createchannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel,
);
userRouter.post(
  "/updatechannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateChannel,
);
userRouter.get("/getchannel", isAuth, getChannelData);
userRouter.post("/togglesubscribe", isAuth, toggleSubscribe);

export default userRouter;
