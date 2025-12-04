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
import { Input, InputProps } from "@/components/ui/input";

type FormInputProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
} & InputProps;

const FormInput = ({
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    ...props
}: FormInputProps) => {
    const { control } = useFormContext();

    const verticalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{`${label}:`}</FormLabel>}

                    {labelHelper && (
                        <span className="text-xs"> {labelHelper}</span>
                    )}

                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            className="w-full md:w-[13rem]"
                            {...props}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const horizontalInput = (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex flex-col md:flex-row w-full gap-2 md:gap-5 md:items-center text-sm">
                        {label && <FormLabel className="md:flex-1">{`${label}:`}</FormLabel>}
                        {labelHelper && (
                            <span className="text-xs"> {labelHelper}</span>
                        )}

                        <div className="w-full md:flex-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={placeholder}
                                    className="w-full md:w-[13rem]"
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
    return vertical ? verticalInput : horizontalInput;
};

export default FormInput;
