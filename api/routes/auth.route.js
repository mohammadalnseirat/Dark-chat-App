import express from "express";
import {
  getCheckAuth,
  logOut,
  signIn,
  signUp,
  updateUserProfile,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/log-out", logOut);
router.put("/update-profile", protectedRoute, updateUserProfile);
router.get("/check-auth", protectedRoute, getCheckAuth);

export default router;
