"use client";

import React from "react";

// RHF
import { useFieldArray } from "react-hook-form";

// Custom components
import { BaseButton, SingleItem } from "@/app/components";

// Icons
import { Plus } from "lucide-react";

// Types
import { ControlType, NameType, UseFormSetValueType } from "@/types";

type ItemsProps = {
    control: ControlType;
    setValue: UseFormSetValueType;
    name: NameType;
};

const Items = ({ control, setValue, name }: ItemsProps) => {
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: name,
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
        <div>
            <hr />

            <div className="flex mt-7">
                <div className="flex flex-col gap-10 w-full">
                    {fields.map((field, index) => (
                        <SingleItem
                            key={field.id}
                            control={control}
                            name={name}
                            index={index}
                            removeField={removeField}
                            setValue={setValue}
                        />
                    ))}
                    <BaseButton
                        tooltipLabel="Add a new item to the list"
                        className="w-fit gap-2"
                        onClick={addNewField}
                    >
                        <Plus />
                        Add a new item
                    </BaseButton>
                </div>
            </div>
        </div>
    );
};

export default Items;
