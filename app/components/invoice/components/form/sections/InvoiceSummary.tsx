"use client";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { Charges, FormTextarea, SignatureModal } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/app/contexts/TranslationContext";

type InvoiceSummaryProps = {};

const InvoiceSummary = ({}: InvoiceSummaryProps) => {
    const { _t } = useTranslationContext();
    return (
        <>
            <Label className="text-xl font-semibold">
                {_t("form.steps.summary.heading")}:
            </Label>
            <div className="flex flex-wrap gap-y-10">
                <div className="flex flex-col gap-3">
                    {/* Signature dialog */}
                    <SignatureModal />

                    {/* Additional notes & Payment terms */}
                    <FormTextarea
                        name="details.additionalNotes"
                        label={_t("form.steps.summary.additionalNotes")}
                        placeholder="Your additional notes"
                    />
                    <FormTextarea
                        name="details.paymentTerms"
                        label={_t("form.steps.summary.paymentTerms")}
                        placeholder="Ex: Net 30"
                    />
                </div>

                <Charges />
            </div>
        </>
    );
};

export default InvoiceSummary;
