//IMPORT PACKAGE

import express from 'express';
import path from 'path';
import cors from 'cors';
import authRouter from './Routes/auth.Router';
import adminRouter from './Routes/admin.Router';
import userRouter from './Routes/user.Router';
import CustomError from './utils/customErrors';


const app=express()

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin:process.env.ORIGIN_URL,
    credentials:true
}))

//USING ROUTES

app.use('/api/v1/auth',authRouter); //auth router
app.use('/api/v1/admin',adminRouter);//admin router
app.use('/api/v1/user',userRouter);//user router

// Define a handler for the root path
app.get('/', (req, res) => {
    res.send('Welcome to our API'); // You can customize this message
});

app.all('*',(req,res,next)=>{
    const err=new CustomError(`Can't find ${req.originalUrl}on the server!`,404);
    next(err);
})

export default app;