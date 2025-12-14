import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config";

const verify = (...roles : string[]) =>{
  return async(req : Request , res : Response , next : NextFunction) =>{
    try {
          const token = req.headers.authorization?.split(" ")[1];
        //   console.log("authToken : ", token );

    if(!token){
       return res.status(401).json({
            success : false,
            message : "Unauthorized access"
        })
    }

    const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
    req.user = decoded;

    if(roles.length && !roles.includes(decoded.role as string)){
        return res.status(403).json({
            success : false,
            message : 'Forbidden access'
        })
    }

    next();
    } catch (error : any) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
  }
}

export default verify