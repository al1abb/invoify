"use client";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

// Types
import { ControlType } from "@/app/types/types";

type InputFormFieldProps = {
    control: ControlType;
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
} & InputProps;

const InputFormField = ({
    control,
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    ...props
}: InputFormFieldProps) => {
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
                            className="w-[13rem]"
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
                    <div className="flex justify-between gap-5 items-center text-sm">
                        {label && <FormLabel>{`${label}:`}</FormLabel>}
                        {labelHelper && (
                            <span className="text-xs"> {labelHelper}</span>
                        )}

                        <div>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={placeholder}
                                    className="w-[13rem]"
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

export default InputFormField;
