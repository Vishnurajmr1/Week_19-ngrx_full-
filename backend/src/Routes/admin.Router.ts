import  auth  from "../middlewares/authMiddleware";
import {
  AdminLogin,
  blockUser,
  deleteuser,
  getAllUsers,
  getUserData,
  updateUser,
} from "../controllers/admin.Controller";
import express from "express";

const router = express.Router();

router.route("/login").post(AdminLogin);
router.route("/getusers").get(auth.protect,getAllUsers);
router.route("/getuser/:id").get(getUserData);
router.route("/updateuser").post(updateUser);
router.route("/deleteuser/:id").delete(auth.protect,auth.restrict('admin'),deleteuser);
router.route("/blockuser/:id").patch(blockUser);
export default router;
