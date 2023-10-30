"use client";

import React from "react";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { FormInput } from "@/app/components";

type PaymentInformationProps = {};

const PaymentInformation = ({}: PaymentInformationProps) => {
    return (
        <>
            <Label className="text-xl font-semibold">
                Payment Information:
            </Label>
            <div className="flex flex-wrap gap-10 mt-5">
                <FormInput
                    name="details.paymentInformation.bankName"
                    label="Bank name"
                    placeholder="Bank name"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.accountName"
                    label="Account name"
                    placeholder="Account name"
                    vertical
                />
                <FormInput
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
