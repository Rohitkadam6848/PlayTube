import { Router } from "express";
import upload from "./../middleware/multer.js";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verfiyOtp,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/signup", upload.single("photoUrl"), signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/googleauth", upload.single("photoUrl"), googleAuth);
authRouter.post("/sendotp", sendOtp);
authRouter.post("/verfiyotp", verfiyOtp);
authRouter.post("/resetpassword", resetPassword);


export default authRouter;
