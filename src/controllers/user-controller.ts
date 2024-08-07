import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IUserInput } from "../models/user-model";
import { login, register, verifyEmail } from '../services/user-service';
import { TokenExpiredError } from "jsonwebtoken";


export interface ILogin {
    email : string,
    password : string
}

export const create = async (req : Request, res : Response, next : NextFunction) => {

    try {
        
        const body : IUserInput = req.body;
        const insert = await register(body);
        return res.status(StatusCodes.OK).json({
            message : "Berhasil Membuat Data User, Silahkan konfirmaasi email",
            status : "success",
            code : "00",
            data : insert
        })
    
    } catch (error) {
        
        next(error);
    
    }   

}

export const verifyEmailRegister = async (req : Request, res : Response, next : NextFunction) => {

    try {
        
        const { token } = req.params;
        await verifyEmail(String(token))
        return res.status(StatusCodes.OK).json({
            message : "Berhasil Memvertifikasi Email User",
            status : "success",
            code : "00",
        })
    
    } catch (error) {
        
        if(error instanceof TokenExpiredError)
        {
            return res.status(StatusCodes.UNAUTHORIZED).send("Link Expired Harap Minta Vertifikasi Ulang");
        }

        next(error);
        
    }

}

export const requestLogin = async (req : Request, res : Response, next : NextFunction) => {

    try {
        
        const body : ILogin = req.body;
        const auth = await login(body); 
        return res.status(StatusCodes.OK).json({
            message : "Berhasil Login",
            status : "success",
            code : "00",
            token : auth
        })

    } catch (error) {
        
        next(error)

    }


}
