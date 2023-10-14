"use client";

import { useWatch } from "react-hook-form";
import { useMemo } from "react";

// Shadcn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Components
import {
    DatePickerFormField,
    FileFormField,
    InputFormField,
    InvoiceFooter,
    Items,
    PaymentInformation,
    SavedInvoiceSelector,
    SelectFormField,
} from "..";

// Types
import {
    ControlType,
    UseFormResetType,
    UseFormSetValueType,
    ValuesType,
} from "@/types";

type InvoiceFormProps = {
    control: ControlType;
    savedInvoices: ValuesType[];
    onSubmit: (values: ValuesType) => void;
    reset: UseFormResetType;
    setValue: UseFormSetValueType;
};

const InvoiceForm = ({
    control,
    savedInvoices,
    onSubmit,
    reset,
    setValue,
}: InvoiceFormProps) => {
    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `Working on #${invoiceNumber}`;
        } else {
            return "(New Invoice)";
        }
    }, [invoiceNumber]);

    return (
        <div className="w-full xl:w-3/4">
            <Card>
                <CardHeader>
                    <CardTitle>INVOICE</CardTitle>
                    <CardDescription>Generate invoice</CardDescription>

                    <small>{invoiceNumberLabel}</small>
                </CardHeader>
                <CardContent>
                    <SavedInvoiceSelector
                        savedInvoices={savedInvoices}
                        onSubmit={onSubmit}
                        reset={reset}
                    />
                    <div className="space-y-8">
                        <FileFormField
                            control={control}
                            name="details.invoiceLogo"
                            label="Invoice Logo"
                            placeholder="Invoice Logo"
                            setValue={setValue}
                        />
                        <div className="flex flex-wrap gap-20">
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="billFrom"
                                    className="text-xl font-semibold"
                                >
                                    Bill From:
                                </Label>

                                <InputFormField
                                    control={control}
                                    name="sender.name"
                                    label="Name"
                                    placeholder="Your name"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.address"
                                    label="Address"
                                    placeholder="Your address"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.zipCode"
                                    label="Zip"
                                    placeholder="Your zip code"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.city"
                                    label="City"
                                    placeholder="Your city"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.country"
                                    label="Country"
                                    placeholder="Your country"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.email"
                                    label="Email"
                                    placeholder="Your email"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.phone"
                                    label="Phone"
                                    placeholder="Your phone number"
                                />
                                <InputFormField
                                    control={control}
                                    name="sender.vatNumber"
                                    label="VAT Number"
                                    placeholder="Your VAT Number"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="billTo"
                                    className="text-xl font-semibold"
                                >
                                    Bill To:
                                </Label>

                                <InputFormField
                                    control={control}
                                    name="receiver.name"
                                    label="Name"
                                    placeholder="Receiver name"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.address"
                                    label="Address"
                                    placeholder="Receiver address"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.zipCode"
                                    label="Zip"
                                    placeholder="Receiver zip code"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.city"
                                    label="City"
                                    placeholder="Receiver city"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.country"
                                    label="Country"
                                    placeholder="Receiver country"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.email"
                                    label="Email"
                                    placeholder="Receiver email"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.phone"
                                    label="Phone"
                                    placeholder="Receiver phone number"
                                />
                                <InputFormField
                                    control={control}
                                    name="receiver.vatNumber"
                                    label="VAT Number"
                                    placeholder="Receiver VAT Number"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="invoiceDetails"
                                    className="text-xl font-semibold"
                                >
                                    Invoice Details:
                                </Label>

                                <InputFormField
                                    control={control}
                                    name="details.invoiceNumber"
                                    label="Invoice number"
                                    placeholder="Invoice number"
                                />

                                <DatePickerFormField
                                    control={control}
                                    name="details.invoiceDate"
                                    label="Issued date"
                                />

                                <DatePickerFormField
                                    control={control}
                                    name="details.dueDate"
                                    label="Due date"
                                />

                                <SelectFormField
                                    control={control}
                                    name="details.currency"
                                    label="Currency"
                                    placeholder="Select Currency"
                                />
                            </div>
                        </div>

                        <div>
                            <Items
                                control={control}
                                setValue={setValue}
                                name="details.items"
                            />
                        </div>

                        <hr />

                        <div>
                            <PaymentInformation
                                control={control}
                                name="details.paymentInformation"
                                label="Payment Information"
                            />
                        </div>

                        <hr />

                        <div className="">
                            <InvoiceFooter
                                control={control}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
