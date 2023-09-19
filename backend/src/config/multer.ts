import multer,{diskStorage,FileFilterCallback} from 'multer';
import path from 'path';
import { Request } from 'express';
import CustomError from '../utils/customErrors';
const storage=multer.diskStorage({
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9);
        cb(null,file.fieldname+'-'+uniqueSuffix+path.extname(file.originalname)); 
    }
});

//FILE VALIDATION

const fileFilter=(req:Request,file:Express.Multer.File,cb:any)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        const error=new CustomError('Only JPEG and PNG images are allowed!',400)
        return cb(error,false);
    }
    if (file.size > 1024 * 1024) {
        const error = new CustomError('File size exceeds the limit of 1MB!',400)
        return cb(error, false);
      }
      cb(null, true);
}

const upload=multer({
    storage,
    limits:{fileSize:2*1024*1024},//2MB limit
    fileFilter,
})

export default upload;


