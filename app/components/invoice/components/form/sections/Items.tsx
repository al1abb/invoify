"use client";

import React from "react";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, SingleItem } from "@/app/components";

// Icons
import { Plus } from "lucide-react";

type ItemsProps = {};

const Items = ({}: ItemsProps) => {
    const { control, setValue } = useFormContext();

    const ITEMS_NAME = "details.items";

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: ITEMS_NAME,
    });

    const addNewField = () => {
        append({
            name: "",
            description: "",
            quantity: 0,
            unitPrice: 0,
            total: 0,
        });
    };

    const removeField = (index: any) => {
        remove(index);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-xl font-semibold">Items:</Label>
            {fields.map((field, index) => (
                <SingleItem
                    key={field.id}
                    name={ITEMS_NAME}
                    index={index}
                    removeField={removeField}
                />
            ))}
            <BaseButton
                tooltipLabel="Add a new item to the list"
                className="w-fit"
                onClick={addNewField}
            >
                <Plus />
                Add a new item
            </BaseButton>
        </div>
    );
};

export default Items;
