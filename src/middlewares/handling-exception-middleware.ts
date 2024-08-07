import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Error, } from "mongoose";

interface IResponseError {
    status : "failed",
    message : string,
    code : number | string | StatusCodes.INTERNAL_SERVER_ERROR
}

export const middlewareHandlingException = (err : any, req : Request, res : Response, next : NextFunction) => 
{
    
    let customError : IResponseError = {
        status: "failed",
        message: err.message || 'Something went wrong try again later',
        code :  err.httpStatusCode || StatusCodes.INTERNAL_SERVER_ERROR
    };

    if(err instanceof Error) 
    {
        if(err instanceof Error.ValidationError)
        {
            customError.code = StatusCodes.BAD_REQUEST;
            customError.message = Object.values(err.errors).map((item) => item.message).join(', ');
        }
    }

    if(err.code)
    {
        if(err.code === 11000)
        {
            customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} `;
            customError.code = StatusCodes.BAD_REQUEST;
        }
    }

    console.log(err.stack)

    return res.status(Number(customError.code)).json(customError);
};
