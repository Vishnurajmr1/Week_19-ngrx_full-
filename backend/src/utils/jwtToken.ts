import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

interface IPayLoad{
    id:string,
    role:string
}

const generateToken=(payload:IPayLoad)=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn:process.env.JWT_LOGIN_EXPIRES
    })
}

export default generateToken;