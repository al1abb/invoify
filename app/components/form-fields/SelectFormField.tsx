"use client";

import React from "react";

// RHF
import { Control } from "react-hook-form";

// Shadcn components
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
import useCurrencies from "../../hooks/useCurrencies";

type SelectFormFieldProps = {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
};

const SelectFormField = ({
    control,
    name,
    label,
    placeholder,
}: SelectFormFieldProps) => {
    const { currencies, currenciesLoading, fetchCurrencies } = useCurrencies();

    return (
        <div>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}:</FormLabel>
                        <Select
                            {...field}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
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
                                        (currency: any, idx: number) => (
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
                    </FormItem>
                )}
            />
        </div>
    );
};

export default SelectFormField;
