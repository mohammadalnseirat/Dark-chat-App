import { handleErrors } from "../utils/error.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

//! Function To Get Users for sidebar:
export const getUserForSidebar = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    //! send the response back:
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error getting user for sidebar", error.message);
    next(error);
  }
};

//! 2-Function To Get Messages:
export const getMessages = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error getting messages", error.message);
    next(error);
  }
};

//! 3-Function To Send Message:
export const sendMessage = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error sending message", error.message);
    next(error);
  }
};
