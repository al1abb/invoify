import { NextResponse } from "next/server";

type HttpErrorInit = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type HttpErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor({ status, code, message, details }: HttpErrorInit) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError;
};

export const toHttpErrorResponse = (
  error: unknown,
  fallback: Pick<HttpErrorInit, "code" | "message"> = {
    code: "internal_error",
    message: "Internal server error",
  }
) => {
  const normalized = isHttpError(error)
    ? error
    : new HttpError({
        status: 500,
        code: fallback.code,
        message: fallback.message,
      });

  const payload: HttpErrorPayload = {
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(typeof normalized.details !== "undefined"
        ? { details: normalized.details }
        : {}),
    },
  };

  return NextResponse.json(payload, {
    status: normalized.status,
  });
};
