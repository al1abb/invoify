"use client";

import { useState } from "react";

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

interface InvoiceFooterProps {
    control: Control<any>;
}

const InvoiceFooter = ({ control }: InvoiceFooterProps) => {
    const [discountSwitch, setDiscountSwitch] = useState<boolean>(false);
    const [taxSwitch, setTaxSwitch] = useState<boolean>(false);
    const [shippingSwitch, setShippingSwitch] = useState<boolean>(false);

    const [subTotal, setSubTotal] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    return (
        <div className="flex flex-wrap gap-5">
            <div className="flex flex-col gap-5">
                <FormField
                    control={control}
                    name="details.additionalNotes"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Additional Notes</Label>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Your additional notes"
                                            className="w-96 h-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="details.paymentTerms"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Payment terms</Label>
                            <div className="flex justify-between gap-5 items-center text-sm">
                                <div>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Ex: Net 30"
                                            className="w-96 h-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col justify-between">
                <div className="flex justify-center gap-x-10">
                    <FormField
                        control={control}
                        name="discount-switch"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Discount</Label>

                                <div>
                                    <FormControl>
                                        <Switch
                                            checked={discountSwitch}
                                            onCheckedChange={(value) => {
                                                setDiscountSwitch(value)
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax-switch"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Tax</Label>

                                <div>
                                    <FormControl>
                                        <Switch
                                            checked={taxSwitch}
                                            onCheckedChange={(value) => {
                                                setTaxSwitch(value)
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="shipping-switch"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Shipping</Label>

                                <div>
                                    <FormControl>
                                        <Switch
                                            checked={shippingSwitch}
                                            onCheckedChange={(value) => {
                                                setShippingSwitch(value)
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <div>
                            Sub total
                        </div>

                        <div>
                            {subTotal}
                        </div>
                    </div>
                    {
                        discountSwitch && (
                            <div>
                                Discount options
                            </div>
                        )
                    }
                    {
                        taxSwitch && (
                            <div>
                                Tax options
                            </div>
                        )
                    }
                    {
                        shippingSwitch && (
                            <div>
                                Shipping options
                            </div>
                        )
                    }

                    <div className="flex justify-between">
                        <div>
                            Total Amount
                        </div>

                        <div>
                            { totalAmount }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFooter;
