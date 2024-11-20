import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";
import bcryptjs from "bcryptjs";

//! 1-Function To Sign Up:
export const signUp = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error signing up", error.message);
    next(error);
  }
};

//! 2-Function To Sign In:
export const signIn = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error signing in", error.message);
    next(error);
  }
};

//! 3-Function To Log Out:
export const logOut = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error logging out", error.message);
    next(error);
  }
};
