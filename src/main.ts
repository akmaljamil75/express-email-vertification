import express, { Request, Response  } from 'express';
import { Config } from './config/config';
import { databaseConnection } from './database/database-connection';
import { exit } from 'process';
import bodyParser from 'body-parser'
import userRoute from '../src/routes/user-route';
import { middlewareHandlingException } from './middlewares/handling-exception-middleware';
import { authorizationMiddleware } from './middlewares/authorization-middleware';

const main = async () => {

    const app = express();
    const port : number = Config.getPort();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Unatheticated endpoints
    app.use("/api",userRoute);
    
    //authenticated endpoints
    app.use(authorizationMiddleware)

    app.use("/", (req : Request, res : Response) => {
        res.send("Welcome To Sarabih");
    })

    try {
       databaseConnection();
    } catch (error) {
        console.log(error);
        exit(1);
    }

    app.listen(port, () => {
        console.log("app listen port : " + port);
    })

    // handling middlewares error
    app.use(middlewareHandlingException);
}

main();

