"use client";

import React from "react";

// Components
import { BaseButton, InputFormField } from "@/app/components";

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
    const nameKey = `${location}[${index}].key`;
    const nameValue = `${location}[${index}].value`;
    return (
        <>
            <div className="flex items-center gap-2">
                <InputFormField
                    name={nameKey}
                    placeholder="Name"
                    className="font-medium p-0 border-none h-[1.5rem] w-[4rem]"
                />

                <InputFormField
                    name={nameValue}
                    placeholder="Value"
                    className="w-[10rem]"
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
