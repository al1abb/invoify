"use client";

import React, { useEffect } from "react";

// RHF
import { FormProvider, useForm } from "react-hook-form";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { InvoiceSchema } from "@/lib/schemas";

// Context
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { InvoiceContextProvider } from "@/contexts/InvoiceContext";
import { ChargesContextProvider } from "@/contexts/ChargesContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Types
import { InvoiceType } from "@/types";

// Variables
import { FORM_DEFAULT_VALUES } from "@/lib/variables";

// Telemetry
import { captureClientError } from "@/lib/telemetry/clientTelemetry";
import { readInvoiceDraft } from "@/lib/storage/invoiceDraft";
import {
  applyUserPreferencesToInvoice,
  readUserPreferences,
} from "@/lib/storage/userPreferences";

type ProvidersProps = {
  children: React.ReactNode;
};

const toDateIfValid = (value: unknown) => {
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? new Date(parsed) : value;
};

const toHydratedDraftForForm = (draft: InvoiceType): InvoiceType => {
  const next = JSON.parse(JSON.stringify(draft)) as InvoiceType;
  next.details.invoiceDate = toDateIfValid(next.details.invoiceDate) as never;
  next.details.dueDate = toDateIfValid(next.details.dueDate) as never;
  return next;
};

const Providers = ({ children }: ProvidersProps) => {
  const form = useForm<InvoiceType>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  // Hydrate once on mount
  useEffect(() => {
    const preferences = readUserPreferences();
    const draftRead = readInvoiceDraft();
    if (draftRead.draft) {
      form.reset(toHydratedDraftForForm(draftRead.draft), {
        keepDefaultValues: false,
      });
    } else {
      form.reset(
        applyUserPreferencesToInvoice(
          FORM_DEFAULT_VALUES as unknown as InvoiceType,
          preferences
        ),
        { keepDefaultValues: false }
      );
    }

    const handleWindowError = (event: ErrorEvent) => {
      captureClientError("app_error", event.error || event.message, {
        source: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      captureClientError("app_unhandled_rejection", event.reason);
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TranslationProvider>
        <AuthProvider>
          <FormProvider {...form}>
            <InvoiceContextProvider>
              <ChargesContextProvider>{children}</ChargesContextProvider>
            </InvoiceContextProvider>
          </FormProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default Providers;
