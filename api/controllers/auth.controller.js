import cloudinary from "../config/cloudinary.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";
import bcryptjs from "bcryptjs";

//! 1-Function To Sign Up:
export const signUp = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (
      !email ||
      !password ||
      !fullName ||
      email === "" ||
      password === "" ||
      fullName === ""
    ) {
      return next(handleErrors(400, "All fields are required"));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(handleErrors(400, "Please enter a valid email address"));
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return next(
        handleErrors(
          401,
          "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters"
        )
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleErrors(400, "email already exists"));
    }
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    //! Create User:
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    if (newUser) {
      //? generate Token:
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      });
    } else {
      return next(handleErrors(400, "Failed to create user"));
    }
  } catch (error) {
    console.log("Error signing up", error.message);
    next(error);
  }
};

//! 2-Function To Sign In:
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(handleErrors(400, "All fields are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleErrors(401, "Invalid credentials"));
    }
    const isMatchPassword = bcryptjs.compareSync(password, user.password);
    if (!isMatchPassword) {
      return next(handleErrors(401, "Invalid email or password"));
    }
    //? generate Token:
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error signing in", error.message);
    next(error);
  }
};

//! 3-Function To Log Out:
export const logOut = async (req, res, next) => {
  try {
    // res.cookie("jwt", "", { maxAge: 0 }); // second way to log out
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error logging out", error.message);
    next(error);
  }
};

//! 4-Function To Update User Profile:
export const updateUserProfile = async (req, res, next) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;
    if (!profilePicture) {
      return next(handleErrors(400, "Profile picture is required"));
    }
    const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadedResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating user profile", error.message);
    next(error);
  }
};

// ! 5-Function To Get Check Auth:
export const getCheckAuth = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error getting check auth", error.message);
    next(error);
  }
};
