import { NextFunction, Request, Response } from "express";
import { JWT_TOKEN_SECRET } from "./config";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res:Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_TOKEN_SECRET);

    if(decoded){
        // @ts-ignore
        req.userId = decoded.userId; // Assuming the token contains a userId
        next();

    }else{
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}