import z from "zod";
import {
    Control,
    FieldPath,
    FieldValues,
    UseFormGetValues,
    UseFormReset,
    UseFormSetValue,
} from "react-hook-form";
import { InvoiceSchema } from "./lib/schemas";

export type ValuesType = z.infer<typeof InvoiceSchema>;
export type ControlType = Control<any>;
export type NameType = FieldPath<ValuesType>;
export type GetValuesType = UseFormGetValues<ValuesType>;
export type UseFormSetValueType = UseFormSetValue<ValuesType>;
export type UseFormResetType = UseFormReset<ValuesType>;
