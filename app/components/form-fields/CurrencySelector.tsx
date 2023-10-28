"use client";

import React from "react";

// ShadCn components
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Hooks
import useCurrencies from "@/app/hooks/useCurrencies";

// Types
import { ControlType, CurrencyType, NameType } from "@/app/types/types";

type CurrencySelectorProps = {
    control: ControlType;
    name: NameType;
    label?: string;
    placeholder?: string;
};

const CurrencySelector = ({
    control,
    name,
    label,
    placeholder,
}: CurrencySelectorProps) => {
    const { currencies, currenciesLoading } = useCurrencies();

    return (
        <div>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <FormLabel>{label}:</FormLabel>
                            </div>
                            <div>
                                <Select
                                    {...field}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[13rem]">
                                            <SelectValue
                                                placeholder={placeholder}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                        style={{
                                            overflowY: "hidden",
                                            height: "200px",
                                        }}
                                    >
                                        {!currenciesLoading &&
                                            currencies.map(
                                                (
                                                    currency: CurrencyType,
                                                    idx: number
                                                ) => (
                                                    <SelectItem
                                                        key={idx}
                                                        value={currency.code}
                                                    >
                                                        {currency.name}{" "}
                                                        {`(${currency.code})`}
                                                    </SelectItem>
                                                )
                                            )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CurrencySelector;
