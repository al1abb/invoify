"use client";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import {
    CurrencySelector,
    DatePickerFormField,
    FormInput,
    FormLogoInput,
    TemplateSelector,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/app/contexts/TranslationContext";

const InvoiceDetails = () => {
    const { _t } = useTranslationContext();

    return (
        <div className="flex flex-col flex-wrap gap-5">
            <Label htmlFor="invoiceDetails" className="text-xl font-semibold">
                {_t("form.steps.invoiceDetails.heading")}:
            </Label>

            <div className="flex flex-row flex-wrap gap-5">
                <div className="flex flex-col gap-2">
                    <FormLogoInput
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
                        placeholder="Invoice number"
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
        </div>
    );
};

export default InvoiceDetails;
