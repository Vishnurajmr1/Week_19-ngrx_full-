import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import CustomError from "../utils/customErrors";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import generateToken from "../utils/jwtToken";
import Apifeatures from "../utils/ApiFeatures";
import { isEqual } from "lodash";

//adminlogin
export const AdminLogin = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new CustomError(
        "Please provide email ID & Password for login in!",
        400
      );
      return next(error);
    }
    //Check if user exists with given email
    const admin = await User.findOne({ email, is_Admin: true }).select(
      "+password"
    );

    const isMatch = await admin?.comparePasswordInDb(password, admin.password);

    //Check if the user exists & password matches
    if (!admin || !isMatch) {
      const error = new CustomError("Invalid credentials!🥴", 400);
      return next(error);
    }
    const token = generateToken({ id: admin._id.toString(), role: "admin" });
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

//list all the users
export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = new Apifeatures(User.find({ is_Admin: false }),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let users = await user.query;

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  }
);
//get single user details

export const getUserData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      const error = new CustomError("User with that ID is not found!", 400);
      return next(error);
    }

    res.status(200).json({
      status: "success",
      user,
    });
  }
);

//Update userdetails
export const updateUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, email, phone, gender } = req.body;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        const error = new CustomError("User with that ID is not found!", 404);
        return next(error);
      }

      const updatedUserData = {
        name,
        email,
        gender,
        phone,
      };
      const isDataChanged = !isEqual(existingUser.toObject(), updatedUserData);

      if (!isDataChanged) {
        return res.status(400).json({
          status: "error",
          message: "No changes made to the user data",
        });
      }
      const user = await User.findByIdAndUpdate(id, updatedUserData, {
        new: true,
      });
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (err: any) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

export const deleteuser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      const error = new CustomError("User with that ID is not found!", 404);
      return next(error);
    }
    res.status(204).json({
      status: "success",
      message: "user deleted successfully",
      data: null,
    });
  }
);

export const blockUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("+is_Blocked");
      if (!user) {
        const error = new CustomError("User with that ID is not found!", 404);
        return next(error);
      }
      //Update the user's is_Blocked field to true
      user.is_Blocked ? (user.is_Blocked = false) : (user.is_Blocked = true);
      // Explicitly set is_Blocked to false when unblocking
      await User.updateOne(
        { _id: userId },
        { $set: { is_Blocked: user.is_Blocked } }
      );

      const statusmessage = user.is_Blocked
        ? "User has been blocked"
        : "User has been unblocked";
      console.log(statusmessage);
      res.status(200).json({
        status: "success",
        message: statusmessage,
      });
    } catch (err: any) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);
