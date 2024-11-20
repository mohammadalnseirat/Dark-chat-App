import jwt from "jsonwebtoken";
import { handleErrors } from "../utils/error.js";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(handleErrors(401, "UnAuthorized - No Access Token Provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(handleErrors(401, "Invalid Access Token"));
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next(handleErrors(404, "Invalid User"));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error while protecting the route: " + error.message);
    next(error);
  }
};

export default protectedRoute;
