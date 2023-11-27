"use client";

import React from "react";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, SingleItem } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/app/contexts/TranslationContext";

// Icons
import { Plus } from "lucide-react";

// Types
import { InvoiceType } from "@/app/types/types";

type ItemsProps = {};

const Items = ({}: ItemsProps) => {
    const { control } = useFormContext<InvoiceType>();

    const { _t } = useTranslationContext();

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

    const removeField = (index: number) => {
        remove(index);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-xl font-semibold">
                {_t("form.steps.lineItems.heading")}:
            </Label>
            {fields.map((field, index) => (
                <SingleItem
                    key={field.id}
                    name={ITEMS_NAME}
                    index={index}
                    fields={fields}
                    removeField={removeField}
                />
            ))}
            <BaseButton
                tooltipLabel="Add a new item to the list"
                className="w-fit"
                onClick={addNewField}
            >
                <Plus />
                {_t("form.steps.lineItems.addNewItem")}
            </BaseButton>
        </div>
    );
};

export default Items;
