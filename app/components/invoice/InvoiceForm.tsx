"use client";

import { useMemo } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// React Wizard
import { Wizard } from "react-use-wizard";

// Components
import {
    WizardStep,
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    PaymentInformation,
    InvoiceFooter,
} from "@/app/components";

type InvoiceFormProps = {};

const InvoiceForm = ({}: InvoiceFormProps) => {
    const { control } = useFormContext();

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
        <div className={`w-full xl:w-[71%]`}>
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
                        <Wizard>
                            <WizardStep>
                                <div className="flex flex-wrap gap-x-20 gap-y-10">
                                    <BillFromSection />

                                    <BillToSection />
                                </div>
                            </WizardStep>
                            <WizardStep>
                                <div className="flex flex-wrap gap-y-10">
                                    <InvoiceDetails />
                                </div>
                            </WizardStep>

                            <WizardStep>
                                <Items />
                            </WizardStep>

                            <WizardStep>
                                <PaymentInformation />
                            </WizardStep>

                            <WizardStep>
                                <InvoiceFooter />
                            </WizardStep>
                        </Wizard>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
