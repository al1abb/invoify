// Zod
import z from "zod";

// RHF
import {
    Control,
    FieldPath,
    UseFormGetValues,
    UseFormReset,
    UseFormReturn,
    UseFormSetValue,
} from "react-hook-form";

// Zod schemas
import { InvoiceSchema, ItemSchema } from "@/lib/schemas";

// Form types
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type ItemType = z.infer<typeof ItemSchema>;
export type CurrencyType = {
    [currencyCode: string]: string;
};
export type FormType = UseFormReturn<InvoiceType>;
export type ControlType = Control<any>;
export type NameType = FieldPath<InvoiceType>;
export type GetValuesType = UseFormGetValues<InvoiceType>;
export type UseFormSetValueType = UseFormSetValue<InvoiceType>;
export type UseFormResetType = UseFormReset<InvoiceType>;

// Signature types
export type SignatureColor = {
    name: string;
    label: string;
    color: string;
};

export type SignatureFont = {
    name: string;
    variable: string;
};

// Wizard types
export type WizardStepType = {
    id: number;
    label: string;
    isValid?: boolean;
};

// Export types
export enum ExportTypes {
    JSON = "JSON",
    CSV = "CSV",
}
