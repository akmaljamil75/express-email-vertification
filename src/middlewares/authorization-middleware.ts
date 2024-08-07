import { NextFunction, Request, Response } from "express"
import { IBodyToken, verifyToken } from "../utils/jwt-util"
import { NormalException } from "../exception/normal-exception";
import { StatusCodes } from "http-status-codes";

export const authorizationMiddleware = async (req: Request, res : Response, next : NextFunction) => {

    try {
        
        const authorizationHeaders = req.headers.authorization;

        if(authorizationHeaders && authorizationHeaders.startsWith("Bearer"))
        {
            const token = authorizationHeaders.substring(7);

            if(!token)
            {
                throw new NormalException("Invalid Token", StatusCodes.UNAUTHORIZED);
            }

            const verify = verifyToken(token);

            const bodyToken : IBodyToken = {
                email: verify?.payload.email,
                role: verify?.payload.role,
                username: verify?.payload.username,
                verified: verify?.payload.verified,
            };

            req['user'] = bodyToken

            next();

        } else {

            throw new NormalException("Authorization token is missing or invalid", StatusCodes.UNAUTHORIZED);

        }

    } catch (error) {

        next(error);
        
    }

}