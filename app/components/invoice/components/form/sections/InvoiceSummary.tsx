"use client";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { Charges, FormTextarea, SignatureModal } from "@/app/components";

type InvoiceSummaryProps = {};

const InvoiceSummary = ({}: InvoiceSummaryProps) => {
    return (
        <>
            <Label className="text-xl font-semibold">Summary:</Label>
            <div className="flex flex-wrap justify-around gap-y-10">
                <div className="flex flex-col gap-3">
                    {/* Signature dialog */}
                    <SignatureModal />

                    {/* Additional notes & Payment terms */}
                    <FormTextarea
                        name="details.additionalNotes"
                        label="Additional notes"
                        placeholder="Your additional notes"
                    />
                    <FormTextarea
                        name="details.paymentTerms"
                        label="Payment terms"
                        placeholder="Ex: Net 30"
                    />
                </div>

                <Charges />
            </div>
        </>
    );
};

export default InvoiceSummary;
