import { StatusCodes } from 'http-status-codes'

export class NormalException extends Error {
    protected httpStatusCode : StatusCodes;
    constructor(message : string, http : StatusCodes){
        super(message)
        this.httpStatusCode = http;
    }
}