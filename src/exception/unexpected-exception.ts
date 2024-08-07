import { StatusCodes } from 'http-status-codes'

export class UnexpectedError extends Error {
    protected httpStatusCode : StatusCodes;
    constructor(message : string){
        super(message)
        this.httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}