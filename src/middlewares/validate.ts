import type { RequestHandler } from 'express';
import { z } from 'zod';

type ValidationSchemas = {
    body?: z.ZodType;
    params?: z.ZodType<Record<string, string>>;
};

export const validate = (schemas: ValidationSchemas): RequestHandler => {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};