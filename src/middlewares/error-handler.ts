import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof z.ZodError) {
        res.status(400).json({
            success: false,
            data: null,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'La solicitud contiene datos inválidos',
                details: error.issues.map((issue) => ({
                    path: issue.path,
                    message: issue.message
                }))
            }
        });
        return;
    }

    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            data: null,
            error: {
                code: 'DATABASE_VALIDATION_ERROR',
                message: 'Los datos enviados no son válidos'
            }
        });
        return;
    }

    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        data: null,
        error: {
            code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message
        }
    });
};