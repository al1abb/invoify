"use client";

import { useMemo } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Shadcn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Components
import {
    FileFormField,
    BillFromSection,
    Items,
    PaymentInformation,
    InvoiceFooter,
    BillToSection,
    InvoiceDetails,
} from "@/app/components";

type InvoiceFormProps = {};

const InvoiceForm = ({}: InvoiceFormProps) => {
    const { control, setValue } = useFormContext();

    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return "New Invoice";
        }
    }, [invoiceNumber]);

    return (
        <div className="w-full xl:w-3/4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        INVOICE
                        <Badge variant="secondary" className="w-fit">
                            <p style={{ fontSize: "14px" }}>
                                {invoiceNumberLabel}
                            </p>
                        </Badge>
                    </CardTitle>
                    <CardDescription>Generate invoice</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <FileFormField
                            control={control}
                            name="details.invoiceLogo"
                            label="Invoice Logo"
                            placeholder="Invoice Logo"
                            setValue={setValue}
                        />
                        <div className="flex flex-wrap gap-20">
                            <BillFromSection />

                            <BillToSection />

                            <InvoiceDetails />
                        </div>

                        <div>
                            <Items
                                control={control}
                                setValue={setValue}
                                name="details.items"
                            />
                        </div>

                        <hr />

                        <div>
                            <PaymentInformation
                                control={control}
                                label="Payment Information"
                            />
                        </div>

                        <hr />

                        <div>
                            <InvoiceFooter
                                control={control}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
