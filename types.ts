// Zod
import z from "zod";

// RHF
import { FieldPath, UseFormReturn } from "react-hook-form";

// Zod schemas
import { InvoiceSchema, ItemSchema } from "@/lib/schemas";

// Form types
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type ItemType = z.infer<typeof ItemSchema>;
export type FormType = UseFormReturn<InvoiceType>;
export type NameType = FieldPath<InvoiceType>;
export type CurrencyType = {
    [currencyCode: string]: string;
};

export type CurrencyDetails = {
    currency: string;
    decimals: number;
    beforeDecimal: string | null;
    afterDecimal: string | null;
};

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

export enum SignatureTabs {
    DRAW = "draw",
    TYPE = "type",
    UPLOAD = "upload",
}

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
    XML = "XML",
    XLSX = "XLSX",
    DOCX = "DOCX",
}

// Settings types
export type FieldRequirementSetting = "required" | "optional" | "hidden";

export type SettingsType = {
    fieldRequirements: {
        senderEmail: FieldRequirementSetting;
        senderPhone: FieldRequirementSetting;
        senderAddress: FieldRequirementSetting;
        senderZipCode: FieldRequirementSetting;
        senderCity: FieldRequirementSetting;
        senderCountry: FieldRequirementSetting;
        receiverEmail: FieldRequirementSetting;
        receiverPhone: FieldRequirementSetting;
        receiverAddress: FieldRequirementSetting;
        receiverZipCode: FieldRequirementSetting;
        receiverCity: FieldRequirementSetting;
        receiverCountry: FieldRequirementSetting;
    };
    discountPerItem: {
        enabled: boolean;
        required: boolean;
    };
    taxPerItem: {
        enabled: boolean;
        required: boolean;
    };
    skuColumn: {
        enabled: boolean;
        required: boolean;
    };
    cashPaymentMode: {
        enabled: boolean;
    };
    currencyDisplay: "symbolOnly" | "symbolAndCode";
};
