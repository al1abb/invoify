"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Shadcn
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Trash2 } from "lucide-react";

type CustomInputFieldProps = {
    index: number;
    location: string;
    removeField: (index: number) => void;
};

const CustomInputField = ({
    index,
    location,
    removeField,
}: CustomInputFieldProps) => {
    const { control } = useFormContext();
    const nameKey = `${location}[${index}].key`;
    const nameValue = `${location}[${index}].value`;
    return (
        <>
            <div className="flex justify-between gap-5">
                <FormField
                    control={control}
                    name={nameKey}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Key"
                                            size={2}
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
                    name={nameValue}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Value"
                                            size={10}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <BaseButton
                    size="icon"
                    variant="destructive"
                    onClick={() => removeField(index)}
                >
                    <Trash2 />
                </BaseButton>
            </div>
        </>
    );
};

export default CustomInputField;
