import { NextFunction, Request, Response } from "express";
import { HttpError } from "../core/http-error";

export function errorHandlerMiddleware (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message
        })
    }

    res.status(500).json({
        statusCode: 500,
        message: "Erro interno do servidor"
    })
}