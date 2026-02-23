"use client";

import { useEffect } from "react";
import NextError from "next/error";
import * as Sentry from "@sentry/nextjs";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
};

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
