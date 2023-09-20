import cloudinary from "../config/cloudinary";
import { Request,Response,NextFunction } from "express";
import { User } from "../models/userModel";
import CustomError from "../utils/customErrors";
import asyncErrorHandler from "../utils/asyncErrorHandler";

export const updateProfile=asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const imagePath=req.file?.path;
        const response=await cloudinary.uploader.upload(imagePath!,{
            folder:`Bingo/profile_images`,
            unique_filename:true
        })
        const secureUrl=response.secure_url;
        const id=(req as any).user._id;
        const user=await User.findByIdAndUpdate(id, { imageUrl: secureUrl });
        if(!user){
            const error=new CustomError('User not found!',404);
            return next(error);
        }
        res.status(200).json({
            status:'success',
            imageUrl:secureUrl
        })
    }catch(err:any){
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }


})