"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea, TextareaProps } from "@/components/ui/textarea";

type FormTextareaProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
} & TextareaProps;

const FormTextarea = ({
    name,
    label,
    labelHelper,
    placeholder,
    ...props
}: FormTextareaProps) => {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{`${label}:`}</FormLabel>}
                    {labelHelper && (
                        <span className="text-xs"> {labelHelper}</span>
                    )}
                    <div className="flex justify-between gap-5 items-center text-sm">
                        <div>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder={placeholder}
                                    className="w-[15rem] h-0"
                                    {...props}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
};

export default FormTextarea;
