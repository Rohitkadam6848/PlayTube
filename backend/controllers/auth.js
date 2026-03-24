import uploadOnCloudinary from "../config/cloudinary.js";
import User from "./../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import gentoken from "../utils/token.js";
import sendMail from "./../config/sendMail.js";
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let photoUrl;

    if (req.file) {
      photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const existuser = await User.findOne({ email });

    if (existuser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "invaild email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must be at least 8 digit" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      photoUrl,
    });

    let token = await gentoken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json({ message: `signup error ${e}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let token = await gentoken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ message: `signin error ${e}` });
  }
};

export const signOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Signout Successfully" });
  } catch (e) {
    return res.status(500).json({ message: `signout error ${e}` });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { username, email, photoUrl } = req.body;

    let googlePhoto = photoUrl;

    if (photoUrl) {
      try {
        googlePhoto = await uploadOnCloudinary(photoUrl);
      } catch (error) {
        console.log(`Cloudinary upload failed ${e}`);
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      await User.create({
        username,
        email,
        photoUrl: googlePhoto,
      });
    } else {
      if (!user.photoUrl && googlePhoto) {
        user.photoUrl = googlePhoto;
        await user.save();
      }
    }

    let token = await gentoken(user?._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ message: `googleAuth error ${e}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.isOtpVerifed = false;

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "otp send successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

export const verfiyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invaild Otp" });
    }

    user.resetOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerifed = true;

    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json(`otp verification error ${error}`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerifed) {
      return res.status(400).json({ message: "Otp verification required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerifed = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json(`Password reset error ${error}`);
  }
};
