"use client";

// Shadcn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Types
import { ControlType, NameType } from "@/app/types/types";

type InputFormFieldProps = {
    control: ControlType;
    name: NameType;
    label?: string;
    placeholder?: string;
};

const InputFormField = ({
    control,
    name,
    label,
    placeholder,
}: InputFormFieldProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <FormLabel>{label}:</FormLabel>
                            </div>
                            <div>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={placeholder}
                                        className="w-[13rem]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </>
    );
};

export default InputFormField;
