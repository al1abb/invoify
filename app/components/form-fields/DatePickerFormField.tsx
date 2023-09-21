"use client"

import React, { useEffect, useState } from "react";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Utils
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Icons
import { CalendarIcon } from "lucide-react";

// RHF
import { Control, UseFormSetValue } from "react-hook-form";

interface DatePickerFormFieldProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    setValue: UseFormSetValue<any>;
}

const DatePickerFormField = ({
    control,
    name,
    label,
    placeholder,
    setValue
}: DatePickerFormFieldProps) => {

    const [date, setDate] = useState<Date | number>(0);

    useEffect(() => {
        if(date instanceof Date) {
            const formattedDate = format(date as Date, "dd/MM/yyyy");
            console.log("Formatted Date", formattedDate);
            setValue(name, formattedDate);
        }
    }, [date])

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <Label>{label}:</Label>
                            </div>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[13.5rem]",
                                                    !date &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </>
    );
};

export default DatePickerFormField;
