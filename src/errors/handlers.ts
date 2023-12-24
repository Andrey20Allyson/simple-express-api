import e from "express";
import { ZodError, z } from "zod";
import { WebApplicationError } from "./web-error";
import { JsonWebTokenError } from "jsonwebtoken";
import { logger } from "../logger";
import { serialize } from "v8";

export function webAppErrorHandler(): e.ErrorRequestHandler {
  return (err, _, res, next) => {
    if (err instanceof WebApplicationError) {
      return res.status(err.status).send(err.message);
    }

    next(err);
  };
}

export function validationErrorHandler(): e.ErrorRequestHandler {
  return (err, _, res, next) => {
    if (err instanceof ZodError) {
      return res.status(400).json(err.errors);
    }

    next(err);
  };
}

export function jwtErrorHandler(): e.ErrorRequestHandler {
  return (err, _, res, next) => {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).send(err.message);
    }

    next(err);
  }
}

export function errorLogger(): e.ErrorRequestHandler {
  return (err, _req, _res, next) => {
    logger.log('Error', err);

    next(err);
  };
}

export function unknowError(): e.ErrorRequestHandler {
  return (err: unknown, _req, res, _next) => {
    if (typeof err === 'number') {
      return res.status(err).end();
    }

    if (typeof err === 'bigint') {
      return res.status(Number(err)).end();
    }

    return res.status(500).send(getMessage(err)).end();
  };
}

function getMessage(err: unknown) {
  if (err instanceof Error) {
    return err.message;
  }

  switch (typeof err) {
    case "string":
      return err;
    case "object":
      const result = z
        .object({ message: z.string() })
        .safeParse(err);

      if (result.success) {
        return result.data.message;
      }
  }

  return serialize(err).toString('utf-8');
}

export const errorHandlers: e.ErrorRequestHandler[] = [
  errorLogger(),
  webAppErrorHandler(),
  validationErrorHandler(),
  jwtErrorHandler(),
  unknowError(),
];