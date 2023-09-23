"use client";

import React, { useEffect, useRef, useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";

// Shadcn components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileFormFieldProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    setValue: UseFormSetValue<any>;
}

const FileFormField = ({
    control,
    name,
    label,
    placeholder,
    setValue,
}: FileFormFieldProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const logoImageRef = useRef<HTMLImageElement | null>(null);
    const [imageExists, setImageExists] = useState(false);

    const [base64Image, setBase64Image] = useState<string>("");

    const removeLogo = () => {
        // Clear the file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Reset imageExists to false
        setImageExists(false);

        // Clear the src attribute of the <img> element
        if (logoImageRef.current) {
            logoImageRef.current.src = "";
        }
    };

    useEffect(() => {
        // setValue("details.invoiceLogo", base64Image);
    }, [base64Image]);

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex flex-col items-start gap-5 text-sm">
                            <div>
                                <Label>{label}:</Label>
                            </div>
                            <div>
                                <FormControl>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files![0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const base64String =
                                                        event.target!
                                                            .result as string;
                                                    setBase64Image(
                                                        base64String
                                                    );
                                                    field.onChange(
                                                        base64String
                                                    ); // Set the value for form submission
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        accept="image/*"
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />

            {imageExists && (
                <>
                    <img
                        id="logoImage"
                        ref={logoImageRef}
                        width={200}
                        height={200}
                    />

                    <Button
                        style={{ width: "fit-content" }}
                        onClick={removeLogo}
                    >
                        Remove logo
                    </Button>
                </>
            )}
        </>
    );
};

export default FileFormField;
