"use client";

import React from "react";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// Shadcn
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, CustomInputField, InputFormField } from "@/app/components";

type BillFromSectionProps = {};

const BillFromSection = (props: BillFromSectionProps) => {
    const { control } = useFormContext();

    const CUSTOM_INPUT_NAME = "sender.customInputs";
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

    const removeCustomInput = (index: any) => {
        remove(index);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="billFrom" className="text-xl font-semibold">
                Bill From:
            </Label>

            {/* // TODO: Remove control from these elements and apply it using useFormContext */}
            <InputFormField
                control={control}
                name="sender.name"
                label="Name"
                placeholder="Your name"
            />
            <InputFormField
                control={control}
                name="sender.address"
                label="Address"
                placeholder="Your address"
            />
            <InputFormField
                control={control}
                name="sender.zipCode"
                label="Zip"
                placeholder="Your zip code"
            />
            <InputFormField
                control={control}
                name="sender.city"
                label="City"
                placeholder="Your city"
            />
            <InputFormField
                control={control}
                name="sender.country"
                label="Country"
                placeholder="Your country"
            />
            <InputFormField
                control={control}
                name="sender.email"
                label="Email"
                placeholder="Your email"
            />
            <InputFormField
                control={control}
                name="sender.phone"
                label="Phone"
                placeholder="Your phone number"
            />
            <InputFormField
                control={control}
                name="sender.vatNumber"
                label="VAT Number"
                placeholder="Your VAT Number"
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

            <BaseButton size="sm" onClick={addNewCustomInput}>
                Add Custom Input
            </BaseButton>
        </div>
    );
};

export default BillFromSection;
