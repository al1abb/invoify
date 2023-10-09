"use client";

import React, { useRef, useState } from "react";
import { Control, FieldPath, UseFormSetValue } from "react-hook-form";

// Shadcn components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Types
import { ControlType, NameType, UseFormSetValueType } from "@/types";

type FileFormFieldProps = {
    control: ControlType;
    name: NameType;
    label?: string;
    placeholder?: string;
    setValue: UseFormSetValueType;
};

const FileFormField = ({
    control,
    name,
    label,
    placeholder,
    setValue,
}: FileFormFieldProps) => {
    const [base64Image, setBase64Image] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target!.result as string;
                setBase64Image(base64String);
                setValue("details.invoiceLogo", base64String); // Set the value for form submission
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setBase64Image("");
        setValue("details.invoiceLogo", "");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            {label}:
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        {base64Image ? (
                            <img
                                id="logoImage"
                                src={base64Image}
                                style={{
                                    objectFit: "contain",
                                    maxWidth: "15rem",
                                    maxHeight: "15rem",
                                    height: "100px",
                                }}
                            />
                        ) : (
                            <div>
                                <Label
                                    htmlFor="logo-input"
                                    className="custom-file-input"
                                >
                                    <>
                                        Click to upload image
                                        <FormControl>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id="logo-input"
                                                onChange={handleInvoiceChange}
                                                accept="image/*"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                </Label>
                            </div>
                        )}
                    </FormItem>
                )}
            />
            {base64Image && (
                <>
                    <Button
                        type="button"
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
