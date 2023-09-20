import jwt from "jsonwebtoken";
import CustomError from "../utils/customErrors";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
  role: "admin" | "user";
}
export default {
  protect: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //1.Read the token & check if exist
      const testToken = req.headers.authorization;
      let token;
      if (testToken && testToken.startsWith("Bearer")) {
        token = testToken.split(" ")[1];
      }
      if (!token) {
        next(new CustomError("You are not logged in!", 401));
      }
      //2.Validate the token
      const decordedToken = jwt.verify(
        token!,
        process.env.JWT_SECRET!
      ) as IDecodedToken;
      //3.If the user exists
      if (decordedToken.role === "user") {
        const user = await User.findById(decordedToken.id);
        if (!user) {
          const error = new CustomError(
            "The user with given token doesnt exist",
            401
          );
          next(error);
        }
      }
      //4.If the user changed password after the token was issued
      const user = await User.findById(decordedToken.id);
      const isPasswordChanged = await user!.isPasswordChanged(
        decordedToken.iat
      );
      if (isPasswordChanged) {
        const error = new CustomError(
          "The password has been changed recently.Please login again",
          401
        );
        return next(error);
      }
      //5.Allow user to access route
      (req as any).user = user;
      next();
    }
  ),
  // adminProtect:asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
  //   //1.Read the token & check if exist
  //    const testToken=req.headers.authorization;
  //    let token;
  //    if(testToken && testToken.startsWith('Bearer')) {
  //       token=testToken.split(' ')[1];
  //    }
  //    if(!token){
  //     next(new CustomError('You are not logged in!',401))
  //    }
  //   //2.Validate the token
  //   const decordedToken=jwt.verify(token!,process.env.JWT_SECRET!) as IDecodedToken;
  //   //3.If the user exists
  //   if (decordedToken.role === "admin") {
  //     const user = await User.findById(decordedToken.id);
  //     if (!user) {
  //       const error=new CustomError("The user with given token doesnt exist", 401);
  //       next(error);
  //     }
  //     (req as any).user = user;
  //   }
  //   //4.If the user changed password after the token was issued
  //   const user=await User.findById(decordedToken.id);
  //   const isPasswordChanged=await user!.isPasswordChanged(decordedToken.iat);
  //   if(isPasswordChanged){
  //     const error=new CustomError('The password has been changed recently.Please login again',401)
  //     return next(error);
  //   }
  //   //5.Allow user to access route
  //   next();

  // })

  restrict: (role: any) => {
    return (req: any, res: Response, next: NextFunction) => {
      if (req.user.role!==role) {
        const error = new CustomError(
          "You do not have permission to perform this action",
          403
        );
        next(error);
      }
      next();
    };
  },
};
