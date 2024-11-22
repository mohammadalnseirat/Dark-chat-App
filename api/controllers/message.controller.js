import { handleErrors } from "../utils/error.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

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
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    //? find the messages:
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    });
    //? send the response back:
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getting messages", error.message);
    next(error);
  }
};

//! 3-Function To Send Message:
export const sendMessage = async (req, res, next) => {
  try {
    const {text,image} = req.body;
    const {id:receiver} = req.params;
    const sender = req.user._id;
    let imageUrl;
    if(image){
      const uploadedImageResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadedImageResponse.secure_url;

    }
    // ? create a new message:
    const newMessage = new Message({
      text,
      image:imageUrl,
      sender,
      receiver
    })

    // ? save the message:
    await newMessage.save();
    //? send the response back:
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending message", error.message);
    next(error);
  }
};
