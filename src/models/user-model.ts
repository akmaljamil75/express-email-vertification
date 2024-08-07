import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    verified?: boolean;
    username: string;
}

export interface IUserInput {
    email: IUser['email'];
    password: IUser['password'];
    role: IUser['role'];
    verified?: IUser['verified'];
    username: IUser['username'];
}

const UserSchema : Schema = new Schema({
    email : {type : String, required : true, unique : true},
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    verified : {type : Boolean, required : false, default : false},
    role : {type : String, required : true},
}, {timestamps : true})

export default mongoose.model<IUser>('users', UserSchema);