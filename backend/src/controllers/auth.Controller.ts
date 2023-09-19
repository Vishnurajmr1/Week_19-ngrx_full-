import {Request,Response,NextFunction } from "express";
import { User } from "../models/userModel";
import asyncErrorHandler from '../utils/asyncErrorHandler'
import generateToken from "../utils/jwtToken";
import CustomError from "../utils/customErrors";

export default {
    signup:asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
        const {gender}=req.body
        let imageUrl;
        if(gender==='male'){
            imageUrl='/images/avatar/male.jpg'
        }else if(gender ==='female'){
            imageUrl='/images/avatar/female.jpg'
        }else{
            imageUrl='/images/avatar/random.png'
        }
       const newUser = await User.create({...req.body,imageUrl});
       const token=generateToken({id:newUser._id.toString(),role:'user'})
       res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
       })
    }),
    login:asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
        const {email,password}=req.body;
        //Check if email & password is present in request body
        if(!email || !password){
            const error=new CustomError('Please provide email ID & Password for login in!',400);
            return next(error);
        }
        //Check if user exists with given email
        const user=await User.findOne({email}).select('+password');

        const isMatch=await user?.comparePasswordInDb(password,user.password);

        //Check if the user exists & password matches
        if(!user ||!isMatch){
            const error=new CustomError('Incorrect email or password',400);
            return next(error);
        }

        const token=generateToken({id:user._id.toString(),role:'user'})

        res.status(200).json({
            status:'success',
            token
        })
    })
}