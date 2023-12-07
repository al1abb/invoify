"use client";

import React from "react";

// RHF
import { FormProvider, useForm } from "react-hook-form";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { InvoiceSchema } from "@/lib/schemas";

// Context
import { ThemeProvider } from "@/app/contexts/ThemeProvider";
import { TranslationProvider } from "@/app/contexts/TranslationContext";
import { InvoiceContextProvider } from "@/app/contexts/InvoiceContext";
import { ChargesContextProvider } from "@/app/contexts/ChargesContext";

// Types
import { InvoiceType } from "@/types";

// Variables
import { FORM_DEFAULT_VALUES } from "@/lib/variables";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
    const form = useForm<InvoiceType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: FORM_DEFAULT_VALUES,
    });

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TranslationProvider>
                <FormProvider {...form}>
                    <InvoiceContextProvider>
                        <ChargesContextProvider>
                            {children}
                        </ChargesContextProvider>
                    </InvoiceContextProvider>
                </FormProvider>
            </TranslationProvider>
        </ThemeProvider>
    );
};

export default Providers;
