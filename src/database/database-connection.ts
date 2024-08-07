import mongoose from "mongoose";
import { Config } from "../config/config";

export const databaseConnection = async () => {
    const mongoUri = Config.getUriMongo();
    await mongoose.connect(mongoUri, {autoCreate : true, autoIndex : true});
}