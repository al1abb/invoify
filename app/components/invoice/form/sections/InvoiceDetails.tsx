"use client";

import { useEffect } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Components
import {
    CurrencySelector,
    DatePickerFormField,
    FormInput,
    FormFile,
    Subheading,
    TemplateSelector,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import { normalizeDocumentType } from "@/lib/invoice/documentType";
import { updateUserPreferences } from "@/lib/storage/userPreferences";
import { InvoiceType } from "@/types";

const InvoiceDetails = () => {
    const { _t } = useTranslationContext();
    const { control, setValue } = useFormContext<InvoiceType>();
    const currency = useWatch({
        control,
        name: "details.currency",
    });
    const documentType = useWatch({
        control,
        name: "details.documentType",
    });

    useEffect(() => {
        const normalizedDocumentType = normalizeDocumentType(documentType);
        if (documentType !== normalizedDocumentType) {
            setValue("details.documentType", normalizedDocumentType, {
                shouldDirty: false,
                shouldTouch: false,
            });
        }
    }, [documentType, setValue]);

    useEffect(() => {
        if (!currency) return;
        updateUserPreferences({
            defaultCurrency: currency,
        });
    }, [currency]);

    return (
        <section className="flex flex-col flex-wrap gap-5">
            <Subheading>{_t("form.steps.invoiceDetails.heading")}:</Subheading>

            <div className="flex flex-row flex-wrap gap-5">
                <div className="flex flex-col gap-2">
                    <FormFile
                        name="details.invoiceLogo"
                        label={_t(
                            "form.steps.invoiceDetails.invoiceLogo.label"
                        )}
                        placeholder={_t(
                            "form.steps.invoiceDetails.invoiceLogo.placeholder"
                        )}
                    />

                    <FormInput
                        name="details.invoiceNumber"
                        label={_t("form.steps.invoiceDetails.invoiceNumber")}
                        placeholder={
                            normalizeDocumentType(documentType) === "quote"
                                ? "Quote number"
                                : "Invoice number"
                        }
                    />

                    <FormField
                        control={control}
                        name="details.documentType"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between gap-5 items-center text-sm">
                                    <FormLabel>
                                        {_t(
                                            "form.steps.invoiceDetails.documentType.label"
                                        )}
                                        :
                                    </FormLabel>
                                    <div>
                                        <Select
                                            value={
                                                normalizeDocumentType(
                                                    field.value
                                                )
                                            }
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="w-[13rem]"
                                                    data-testid="document-type-select"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="invoice">
                                                    {_t(
                                                        "form.steps.invoiceDetails.documentType.options.invoice"
                                                    )}
                                                </SelectItem>
                                                <SelectItem value="quote">
                                                    {_t(
                                                        "form.steps.invoiceDetails.documentType.options.quote"
                                                    )}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <DatePickerFormField
                        name="details.invoiceDate"
                        label={_t("form.steps.invoiceDetails.issuedDate")}
                    />

                    <DatePickerFormField
                        name="details.dueDate"
                        label={_t("form.steps.invoiceDetails.dueDate")}
                    />

                    <CurrencySelector
                        name="details.currency"
                        label={_t("form.steps.invoiceDetails.currency")}
                        placeholder="Select Currency"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <TemplateSelector />
                </div>
            </div>
        </section>
    );
};

export default InvoiceDetails;
