import { errorHandler } from "./error.js";
import  jwt  from "jsonwebtoken";

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;

    if(!token) return next(errorHandler(401,'Forbidden'));

    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        //here user is nothing but an id
        if(err) return  next(errorHandler(403,'Forbidden'));

        req.user = user;
        next();
    } );
}