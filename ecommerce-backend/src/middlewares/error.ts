import  { NextFunction, Request, Response } from 'express'
import errorHandler from '../utils/utility-class.js'
import { controllerType } from '../types/types.js'

export const errorMiddleware = ((err:errorHandler,req:Request,res:Response,next:NextFunction)=>{
    err.message ||= "Internal server error"
    err.statusCode ||= 500

    if(err.name === "castError") err.message = "Invalid Id"
    
    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
    })

//WRAPPER FUNCTION
    export const tryCatch = (func:controllerType) => (req:Request,res:Response,next:NextFunction) => {
    return Promise.resolve(func(req,res,next)).catch(next)
    }

    