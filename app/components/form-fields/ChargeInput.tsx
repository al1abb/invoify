"use client";

import React from "react";

// Shadcn
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Icons
import { Percent, RefreshCw } from "lucide-react";

// Types
import { ControlType, NameType } from "@/types";

type ChargeInputProps = {
    label: string;
    control: ControlType;
    name: NameType;
    switchAmountType: (
        type: string,
        setType: React.Dispatch<React.SetStateAction<string>>
    ) => void;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    currency: string;
};

const ChargeInput = ({
    label,
    control,
    name,
    switchAmountType,
    type,
    setType,
    currency,
}: ChargeInputProps) => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div>{label}</div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => switchAmountType(type, setType)}
                    >
                        <RefreshCw />
                    </Button>

                    <FormField
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between gap-5 items-center text-sm">
                                    <div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-28"
                                                placeholder="Discount"
                                                type="number"
                                                min="0"
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    {type == "percentage" ? <Percent /> : <div>{currency}</div>}
                </div>
            </div>
        </>
    );
};

export default ChargeInput;
