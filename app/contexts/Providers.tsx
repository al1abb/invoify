"use client";

import React from "react";

// Zod and RHF
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

// Schema
import { InvoiceSchema } from "@/lib/schemas";

// Context
import { InvoiceContextProvider } from "@/app/contexts/InvoiceContext";

// Types
import { ValuesType } from "@/types";

// Variables
import { FORM_DEFAULT_VALUES } from "@/lib/variables";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
    const form = useForm<ValuesType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: FORM_DEFAULT_VALUES,
    });

    const { getValues } = form;

    return (
        <FormProvider {...form}>
            <InvoiceContextProvider getValues={getValues}>
                {children}
            </InvoiceContextProvider>
        </FormProvider>
    );
};

export default Providers;
