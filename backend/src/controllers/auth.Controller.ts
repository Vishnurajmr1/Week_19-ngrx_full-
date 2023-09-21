import {Request,Response,NextFunction } from "express";
import { User } from "../models/userModel";
import asyncErrorHandler from '../utils/asyncErrorHandler'
import generateToken from "../utils/jwtToken";
import CustomError from "../utils/customErrors";

export default {
    signup:asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
        const {gender,role}=req.body
        let imageUrl;
        let is_Admin;
        if(gender==='male'){
            imageUrl='/images/avatar/male.jpg'
        }else if(gender ==='female'){
            imageUrl='/images/avatar/female.jpg'
        }else{
            imageUrl='/images/avatar/random.png'
        }
        if(role && role=='admin'){
            is_Admin=true;
        }else{
            is_Admin=false;
        }
       const newUser = await User.create({...req.body,imageUrl,is_Admin});
       const token=generateToken({id:newUser._id.toString(),role})
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
        console.log(email);
        console.log(password);
        //Check if email & password is present in request body
        if(!email || !password){
            const error=new CustomError('Please provide email ID & Password for login in!',400);
            return next(error);
        }
        //Check if user exists with given email
        const user=await User.findOne({email:email}).select('+password');
        const isMatch=await user?.comparePasswordInDb(password,user.password);
        //Check if the user exists & password matches
        if(!user ||!isMatch){
            const error=new CustomError('Incorrect email or password',400);
            return next(error);
        }else if(user.is_Blocked){
            const error=new CustomError('User has been blocked',400);
            return next(error);
        }

        const token=generateToken({id:user._id.toString(),role:'user'})

        res.status(200).json({
            status:'success',
            token
        })
    })
}