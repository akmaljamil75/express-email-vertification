import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import nodemailer from 'nodemailer';
import { Config } from '../config/config';
import { NormalException } from '../exception/normal-exception';
import model, { IUserInput } from '../models/user-model';
import { generateToken, generateTokenVerifyEmail, IBodyToken, verifyToken } from '../utils/jwt-util';
import { ILogin } from '../controllers/user-controller';
import { promisify } from 'util';
import fs from 'fs'
import handlebars from 'handlebars';

const readFile = promisify(fs.readFile);

export const register = async (payload : IUserInput) => {

    const hash = await bcryptjs.hash(payload.password, 12);
    
    const body : IUserInput = {
        email : payload.email,
        password : hash,
        role : payload.role,
        verified : false,
        username : payload.username
    }

    const insert = await model.create(body);
    
    const bodyToken : IBodyToken = {
        email : payload.email,
        role : payload.role,
        verified : false,
        username : payload.username
    }
    const token = generateTokenVerifyEmail(bodyToken);
    
    await sendVerifyEmail(body.email, token, body.username);
    delete insert._id;
    return insert;
}

export const sendVerifyEmail = async (email : string, token : string, username : string) => {


    let html = await readFile('src/index.html', 'utf8');
    let template = handlebars.compile(html);
    let data = {
        username: username,
        url : `Please verify your email by clicking the following link: http://localhost:3000/user/verify-email/${token}`
    };

    let htmlToSend = template(data);

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: Config.getEmailUser(),
        port: 465,
        secure: true,
        auth: {
          user: Config.getEmailUser(),
          pass: Config.getEmailPassword(),
        },
      });

    return await transporter.sendMail({
        from: Config.getEmailUser(),
        to: email,
        subject: 'Email Verification',
        html : htmlToSend
    });

} 

export const verifyEmail = async (token : string) => {

    const verify = verifyToken(token);
    const bodyToken : IBodyToken = {
        email: verify?.payload.email,
        role: verify?.payload.role,
        username: verify?.payload.username,
        verified: verify?.payload.verified,
    };

    if(verify.payload.verified) {
        throw new NormalException("Email Sudah DiVertifikasi", StatusCodes.TOO_MANY_REQUESTS);
    }

    const bodyUpdate = {
        verified : true
    }

    const findEmail = await model.findOneAndUpdate(bodyToken, bodyUpdate);

    if(!findEmail) {
        throw new NormalException("Email Not Found!!!", StatusCodes.NOT_FOUND);
    }

    return findEmail;
}

export const login = async (body : ILogin) => {

    const findUser = await model.findOne({email : body.email});
    if(!findUser) {
        throw new NormalException("Username Tidak Ditemukan", StatusCodes.NOT_FOUND);
    }

    const compare = await bcryptjs.compare(body.password, findUser.password);
    if(!compare) {
        throw new NormalException("Password Yang Dimasukan Salah", StatusCodes.BAD_REQUEST);
    }

    if(!findUser.verified) {
        throw new NormalException("Email Belum DiVertifikasi, Silahkan Melakukan Permintaan Vertifikasi", StatusCodes.UNAUTHORIZED);
    }

    const bodyToken : IBodyToken = {
        email : findUser.email,
        role : findUser.role,
        username : findUser.username,
        verified : findUser.verified,
    }

    const token = generateToken(bodyToken);

    return token;
}