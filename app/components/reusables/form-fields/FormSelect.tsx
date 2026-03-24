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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


type FormSelectProps = {
    name: string;
    label?: string;
    placeholder?: string;
    options: { label: string; value: string }[];
    vertical?: boolean;
    defaultValue?: string;
};

const FormSelect = ({
    name,
    label,
    placeholder,
    options,
    vertical = false,
    defaultValue,
}: FormSelectProps) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as any}
            render={({ field }) => (
                <FormItem className={vertical ? "flex flex-col gap-2" : ""}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || defaultValue}
                        value={field.value || defaultValue || ""}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormSelect;
