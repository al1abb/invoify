"use client";

import React, { useEffect } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Shadcn UI components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, InputFormField } from "@/app/components";

// Icons
import { Trash2 } from "lucide-react";

// Types
import { NameType } from "@/app/types/types";

type SingleItemProps = {
    name: NameType;
    index: number;
    removeField: (index: number) => void;
};

const SingleItem = ({ name, index, removeField }: SingleItemProps) => {
    const { control, setValue } = useFormContext();

    // Get rate variable
    const rate = useWatch({
        name: `${name}[${index}].unitPrice`,
        control,
    });

    // Get quantity variable
    const quantity = useWatch({
        name: `${name}[${index}].quantity`,
        control,
    });

    // Get currency variable
    const currency = useWatch({
        name: `details.currency`,
        control,
    });

    // Get currency variable
    const total = useWatch({
        name: `${name}[${index}].total`,
        control,
    });

    useEffect(() => {
        // Calculate total when rate or quantity changes
        if (rate != undefined && quantity != undefined) {
            const calculatedTotal = (rate * quantity).toFixed(2);
            setValue(`${name}[${index}].total`, calculatedTotal);
        }
    }, [rate, quantity]);

    return (
        <div className="flex flex-col gap-y-5 my-2">
            Item #{index + 1}
            <div className="flex flex-wrap gap-x-10 gap-y-5" key={index}>
                <InputFormField
                    name={`${name}[${index}].name`}
                    label="Name"
                    placeholder="Item name"
                    vertical
                />

                <InputFormField
                    name={`${name}[${index}].quantity`}
                    type="number"
                    label="Quantity"
                    placeholder="Quantity"
                    className="w-[8rem]"
                    vertical
                />

                <InputFormField
                    name={`${name}[${index}].unitPrice`}
                    type="number"
                    label="Rate"
                    labelHelper={`(in ${currency})`}
                    placeholder="Unit price/Rate"
                    className="w-[8rem]"
                    vertical
                />

                <div className="flex flex-col gap-2">
                    <div>
                        <Label>Total</Label>
                    </div>
                    <Input
                        value={`${total} ${currency}`}
                        readOnly
                        placeholder="Item total"
                        className="border-none font-medium text-lg"
                        size={10}
                    />
                </div>
            </div>
            <FormField
                control={control}
                name={`${name}[${index}].description`}
                render={({ field }) => (
                    <FormItem>
                        <Label>Description</Label>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Item description"
                                        className="w-[15rem] h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
            <div>
                {/* Not allowing deletion for first item and making sure that there is always at least 1 item */}
                {index != 0 && (
                    <BaseButton
                        variant="destructive"
                        className="w-fit gap-2"
                        onClick={() => removeField(index)}
                    >
                        <Trash2 />
                        Remove Item
                    </BaseButton>
                )}
            </div>
            <hr />
        </div>
    );
};

export default SingleItem;
