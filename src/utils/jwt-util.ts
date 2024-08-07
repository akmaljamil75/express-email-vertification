import jwt from 'jsonwebtoken';
import { Config } from '../config/config';

export interface IBodyToken {
    role : string,
    email : string,
    username : string,
    verified : boolean
}

export const generateToken = (payload : IBodyToken) : string => {
    const secretKey = Config.getJwtSecret();
    return jwt.sign({payload}, secretKey, {expiresIn : '1h'})
}

export const verifyToken = (token : string) : any => {
    const secretKey = Config.getJwtSecret();
    return jwt.verify(token, secretKey);
}

export const generateTokenVerifyEmail = (payload : IBodyToken) : string => {
    const secretKey = Config.getJwtSecret();
    return jwt.sign({payload}, secretKey, {expiresIn : '15m'})
}