"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Components
import { Charges, SignatureModal } from "@/app/components";

// Types
import { InvoiceType } from "@/app/types/types";

type InvoiceSummaryProps = {};

const InvoiceSummary = ({}: InvoiceSummaryProps) => {
    const { control } = useFormContext<InvoiceType>();

    return (
        <>
            <Label className="text-xl font-semibold">Summary:</Label>
            <div className="flex flex-wrap justify-around gap-y-10">
                {/* Additional notes & Payment terms */}
                <div className="flex flex-col gap-3">
                    <SignatureModal />

                    {/* Turn these into custom textarea components */}
                    <FormField
                        control={control}
                        name="details.additionalNotes"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Additional Notes</Label>
                                <div className="flex justify-between gap-5 items-center text-sm">
                                    <div>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Your additional notes"
                                                className="w-[15rem] h-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="details.paymentTerms"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Payment terms</Label>
                                <div className="flex justify-between gap-5 items-center text-sm">
                                    <div>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Ex: Net 30"
                                                className="w-[15rem] h-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <Charges />
            </div>
        </>
    );
};

export default InvoiceSummary;
