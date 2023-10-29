"use client";

import React from "react";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, CustomInputField, InputFormField } from "@/app/components";

// Icons
import { Plus } from "lucide-react";

type BillToSectionProps = {};

const BillToSection = ({}: BillToSectionProps) => {
    const { control } = useFormContext();

    const CUSTOM_INPUT_NAME = "receiver.customInputs";

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: CUSTOM_INPUT_NAME,
    });

    const addNewCustomInput = () => {
        append({
            key: "",
            value: "",
        });
    };

    const removeCustomInput = (index: number) => {
        remove(index);
    };

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="billTo" className="text-xl font-semibold">
                Bill To:
            </Label>

            <InputFormField
                name="receiver.name"
                label="Name"
                placeholder="Receiver name"
            />
            <InputFormField
                name="receiver.address"
                label="Address"
                placeholder="Receiver address"
            />
            <InputFormField
                name="receiver.zipCode"
                label="Zip"
                placeholder="Receiver zip code"
            />
            <InputFormField
                name="receiver.city"
                label="City"
                placeholder="Receiver city"
            />
            <InputFormField
                name="receiver.country"
                label="Country"
                placeholder="Receiver country"
            />
            <InputFormField
                name="receiver.email"
                label="Email"
                placeholder="Receiver email"
            />
            <InputFormField
                name="receiver.phone"
                label="Phone"
                placeholder="Receiver phone number"
            />

            {/* //? key = field.id fixes a bug where wrong field gets deleted  */}
            {fields?.map((field, index) => (
                <CustomInputField
                    key={field.id}
                    index={index}
                    location={CUSTOM_INPUT_NAME}
                    removeField={removeCustomInput}
                />
            ))}

            <BaseButton
                tooltipLabel="Add custom input to receiver"
                size="sm"
                variant="link"
                className="w-fit"
                onClick={addNewCustomInput}
            >
                <Plus />
                Add Custom Input
            </BaseButton>
        </div>
    );
};

export default BillToSection;
