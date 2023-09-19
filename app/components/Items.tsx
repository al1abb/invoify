"use client";

import React from "react";
import { Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SingleItem } from ".";

interface ItemsProps {
    control: Control<any>;
    name: string;
}

const Items: React.FC<ItemsProps> = ({ control, name }) => {
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
        console.log("Removing index:", index);
        remove(index)
    }

    return (
        <div>
            {/* <div className="flex justify-between">
                <div>Item name</div>
                <div>Qty</div>
                <div>Unit price/Rate</div>
                <div>Item total</div>
            </div> */}

            <hr />

            <div className="flex mt-7">
                <div className="flex flex-col gap-10">
                    {fields.map((field, index) => (
                        <SingleItem 
                            key={field.id}
                            control={control}
                            name={name}
                            field={field}
                            index={index}
                            removeField={removeField}
                        />
                    ))}
                    <Button onClick={addNewField}>Add item</Button>
                </div>
            </div>
        </div>
    );
};

export default Items;
