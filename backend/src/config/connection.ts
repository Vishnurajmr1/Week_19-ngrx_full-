import mongoose from 'mongoose';

const uri:string=String(process.env.MONGO_URL);
mongoose.connection.once("open",()=>{
    console.log("MongoDB  connection is ready!🙂");
})
mongoose.connection.on("error",(err)=>{
    console.error("Database not connected!!!"+err)
})

 async function mongoConnect(){
    await mongoose.connect(uri,{
        retryWrites:true,
        w:"majority"
    });
}

export default mongoConnect;
