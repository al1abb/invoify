"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Components
import { ChargeInput } from "@/app/components";

// Contexts
import { useChargesContext } from "@/app/contexts/ChargesContext";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Types
import { InvoiceType } from "@/app/types/types";

type ChargesProps = {};

const Charges = ({}: ChargesProps) => {
    const {
        formState: { errors },
    } = useFormContext<InvoiceType>();

    const {
        discountSwitch,
        setDiscountSwitch,
        taxSwitch,
        setTaxSwitch,
        shippingSwitch,
        setShippingSwitch,
        discountType,
        setDiscountType,
        taxType,
        setTaxType,
        shippingType,
        setShippingType,
        totalInWordsSwitch,
        setTotalInWordsSwitch,
        currency,
        subTotal,
        totalAmount,
    } = useChargesContext();

    const switchAmountType = (
        type: string,
        setType: (type: string) => void
    ) => {
        if (type == "amount") {
            setType("percentage");
        } else {
            setType("amount");
        }
    };
    return (
        <>
            {/* Charges */}
            <div className="flex flex-col gap-3 min-w-[20rem]">
                {/* Switches */}
                <div className="flex justify-evenly pb-6">
                    <div>
                        <Label>Discount</Label>

                        <div>
                            <div>
                                <Switch
                                    checked={discountSwitch}
                                    onCheckedChange={(value) => {
                                        setDiscountSwitch(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Tax</Label>

                        <div>
                            <div>
                                <Switch
                                    checked={taxSwitch}
                                    onCheckedChange={(value) => {
                                        setTaxSwitch(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Shipping</Label>

                        <div>
                            <div>
                                <Switch
                                    checked={shippingSwitch}
                                    onCheckedChange={(value) => {
                                        setShippingSwitch(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center px-5 gap-y-3">
                    <div className="flex justify-between items-center">
                        <div>Sub total</div>

                        <div>
                            {formatNumberWithCommas(subTotal)} {currency}
                        </div>
                    </div>
                    {discountSwitch && (
                        <ChargeInput
                            label="Discount"
                            name="details.discountDetails.amount"
                            switchAmountType={switchAmountType}
                            type={discountType}
                            setType={setDiscountType}
                            currency={currency}
                        />
                    )}

                    {taxSwitch && (
                        <ChargeInput
                            label="Tax"
                            name="details.taxDetails.amount"
                            switchAmountType={switchAmountType}
                            type={taxType}
                            setType={setTaxType}
                            currency={currency}
                        />
                    )}

                    {shippingSwitch && (
                        <ChargeInput
                            label="Shipping"
                            name="details.shippingDetails.cost"
                            switchAmountType={switchAmountType}
                            type={shippingType}
                            setType={setShippingType}
                            currency={currency}
                        />
                    )}

                    <div className="flex justify-between items-center">
                        <div>Total Amount</div>

                        <div className="">
                            <p>
                                {formatNumberWithCommas(totalAmount)} {currency}
                            </p>

                            <small className="text-sm font-medium text-destructive">
                                {errors.details?.totalAmount?.message}
                            </small>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p>Include total in words?</p>{" "}
                        <p>{totalInWordsSwitch ? "Yes" : "No"}</p>
                        <Switch
                            checked={totalInWordsSwitch}
                            onCheckedChange={(value) => {
                                setTotalInWordsSwitch(value);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Charges;
