"use client";

import React, { useRef, useState } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { ImageMinus, Image } from "lucide-react";

// Types
import { NameType } from "@/app/types/types";

type FormLogoInputProps = {
    name: NameType;
    label?: string;
    placeholder?: string;
};

const FormLogoInput = ({ name, label, placeholder }: FormLogoInputProps) => {
    const { control, setValue } = useFormContext();

    const logoImage = useWatch({
        name: "details.invoiceLogo",
        control,
    });

    const [base64Image, setBase64Image] = useState<string>(logoImage ?? "");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
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
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <Label>{label}:</Label>
                        {base64Image ? (
                            <img
                                id="logoImage"
                                src={base64Image}
                                style={{
                                    objectFit: "contain",
                                    width: "10rem",
                                    height: "7rem",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    objectFit: "contain",
                                    width: "10rem",
                                    height: "7rem",
                                }}
                            >
                                <Label
                                    htmlFor="logo-input"
                                    className="custom-logo-input cursor-pointer border border-black rounded-md hover:border-blue-500"
                                >
                                    <>
                                        <div className="flex flex-col items-center">
                                            <Image />
                                            <p>{placeholder}</p>
                                        </div>
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
                <div>
                    <BaseButton variant="destructive" onClick={removeLogo}>
                        <ImageMinus />
                        Remove logo
                    </BaseButton>
                </div>
            )}
        </>
    );
};

export default FormLogoInput;
