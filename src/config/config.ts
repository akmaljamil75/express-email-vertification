import dotenv from 'dotenv';

dotenv.config();

export class Config {

    public static getPort() : number {
        return parseInt(process.env.PORT);
    }

    public static getUriMongo() : string {
        return String(process.env.MONGO_URI);
    }

    public static getJwtSecret() : string {
        return String(process.env.SECRET_KEY);
    }

    public static getEmailUser() : string {
        return String(process.env.EMAIL_USER);
    }

    public static getEmailPassword() : string {
        return String(process.env.EMAIL_PASSWORD);
    }

}
