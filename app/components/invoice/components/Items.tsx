"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";

// Custom components
import { SingleItem } from "../..";

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
        name: name, // Match this name to the field in your schema
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
                <div className="flex flex-col gap-10">
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
                    <Button
                        type="button"
                        onClick={addNewField}
                        className="w-fit gap-2"
                    >
                        <Plus />
                        Add a new item
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Items;
