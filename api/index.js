import mongoose from "mongoose";
import express from "express"
import dotenv from'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import listingRoute from'./routes/listing.route.js'



dotenv.config({path:'../.env'});
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);

})


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRoute);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "invalid Server error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });

})

app.listen(3000,()=>{
    console.log("server is running");
})



