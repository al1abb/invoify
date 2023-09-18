"use client"

import React, { useEffect, useState } from "react";

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control, FieldValues } from "react-hook-form";

interface SingleItemProps {
    control: Control<any>;
    name: string;
    field: FieldValues;
    index: number,
    removeField: (index: number) => void;
}

const SingleItem = ({ control, name, field, index, removeField }: SingleItemProps) => {

    console.log("Field ID:", field.id);
    console.log("Index:", index);
    
    // Initialize state for unitPrice, quantity, and total
    const [unitPrice, setUnitPrice] = useState(field.unitPrice || 0);
    const [quantity, setQuantity] = useState(field.quantity || 0);
    const [total, setTotal] = useState(unitPrice * quantity);

    // Update total when unitPrice or quantity change
    useEffect(() => {
        setTotal(unitPrice * quantity);
    }, [unitPrice, quantity]);

    // Handle changes in unitPrice and quantity
    const handleUnitPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newUnitPrice = parseFloat(event.target.value);
        setUnitPrice(newUnitPrice);
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseFloat(event.target.value);
        setQuantity(newQuantity);
    };
    
    return (
        <>
            <div className="flex gap-10" key={index}>
                <FormField
                    control={control}
                    name={`${name}[${index}].name`} // Generate unique name for each field
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input {...field} placeholder="Item name" />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}[${index}].quantity`} // Generate unique name for each field
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="Quantity" value={quantity} onChange={handleQuantityChange} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}[${index}].unitPrice`} // Generate unique name for each field
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="Unit price/Rate" value={unitPrice} onChange={handleUnitPriceChange} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}[${index}].total`} // Generate unique name for each field
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="number" 
                                            readOnly 
                                            placeholder="Item total" 
                                            value={total.toFixed(2)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            
            <Button onClick={() => removeField(index)}>-</Button>
        </>
    );
};

export default SingleItem;
