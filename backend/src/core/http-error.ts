export class HttpError extends Error {
    public readonly statusCode: number;

    constructor (message: string, statusCode: number = 400) {
        super(message)
        this.statusCode = statusCode

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor)
    }
}