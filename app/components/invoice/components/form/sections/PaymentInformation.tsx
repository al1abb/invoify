"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { InputFormField } from "@/app/components";

type PaymentInformationProps = {};

const PaymentInformation = (props: PaymentInformationProps) => {
    const { control } = useFormContext();
    return (
        <>
            <Label htmlFor="billFrom" className="text-xl font-semibold">
                Payment Information:
            </Label>
            <div className="flex flex-wrap gap-10 mt-5">
                <InputFormField
                    control={control}
                    name="details.paymentInformation.bankName"
                    label="Bank name"
                    placeholder="Bank name"
                    vertical
                />
                <InputFormField
                    control={control}
                    name="details.paymentInformation.accountName"
                    label="Account name"
                    placeholder="Account name"
                    vertical
                />
                <InputFormField
                    control={control}
                    name="details.paymentInformation.accountNumber"
                    label="Account number"
                    placeholder="Account number"
                    vertical
                />
            </div>
        </>
    );
};

export default PaymentInformation;
