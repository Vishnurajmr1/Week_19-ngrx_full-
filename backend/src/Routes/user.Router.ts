import express from "express";
import upload from "../config/multer";
import auth from "../middlewares/authMiddleware";
import { updateProfile } from "../controllers/user.Controller";

const router = express.Router();

router
  .route("/uploadprofile")
  .put(auth.protect, upload.single("image"), updateProfile);

export default router;
