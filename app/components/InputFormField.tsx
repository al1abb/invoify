"use client";

import React, { ReactNode } from "react";
import { Control } from "react-hook-form";
import { Invoice } from "@/types";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFormFieldProps {
    control: Control<any>;
    name: string;
    label: string;
    placeholder: string;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
    control,
    name,
    label,
    placeholder,
}) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="grid grid-flow-col items-center text-sm gap-10">
                                <div>
                                    <Label
                                        className="text-sm"
                                    >
                                        {label}:
                                    </Label>
                                </div>
                                <div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={placeholder}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </>
    );
};

export default InputFormField;
