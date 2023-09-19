//IMPORT PACKAGE

import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import authRouter from './Routes/authRouter';
import adminRouter from './Routes/admin.Router';
import CustomError from './utils/customErrors';

const app=express()

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin:process.env.ORIGIN_URL,
    credentials:true
}))

//USING ROUTES

app.use('/api/v1/users',authRouter); //auth router
app.use('/api/v1/admin',adminRouter);//admin router

// Define a handler for the root path
app.get('/', (req, res) => {
    res.send('Welcome to our API'); // You can customize this message
});

app.all('*',(req,res,next)=>{
    const err=new CustomError(`Can't find ${req.originalUrl}on the server!`,404);
    next(err);
})

export default app;