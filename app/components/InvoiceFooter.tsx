"use client";

import { useEffect, useRef, useState } from "react";

// RHF imports
import { useWatch } from "react-hook-form";

// Shadcn components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// React signature canvas
import SignatureCanvas from "react-signature-canvas";

// Icons
import { Percent, RefreshCw } from "lucide-react";

// Formatter
import { formatNumberWithCommas } from "@/lib/formatter";

// Types
import { ControlType, UseFormSetValueType } from "@/types";

type InvoiceFooterProps = {
    control: ControlType;
    setValue: UseFormSetValueType;
};

const InvoiceFooter = ({ control, setValue }: InvoiceFooterProps) => {
    const [discountSwitch, setDiscountSwitch] = useState<boolean>(false);
    const [taxSwitch, setTaxSwitch] = useState<boolean>(false);
    const [shippingSwitch, setShippingSwitch] = useState<boolean>(false);

    const [subTotal, setSubTotal] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const signatureRef = useRef<SignatureCanvas | null>(null);

    const clearSignature = () => {
        signatureRef.current?.clear();
        setValue("details.signature", "");
    };

    const handleCanvasEnd = () => {
        if (signatureRef.current) {
            const canvas = signatureRef.current;
            setValue("details.signature", canvas.toDataURL("base64"));
        }
    };

    // Get items array
    const itemsArray = useWatch({
        name: `details.items`,
        control,
    });

    const discount = useWatch({
        name: `details.discountDetails`,
        control,
    });

    const tax = useWatch({
        name: `details.taxDetails`,
        control,
    });

    const shipping = useWatch({
        name: `details.shippingDetails`,
        control,
    });

    const currency = useWatch({
        name: `details.currency`,
        control,
    });

    // Switch variables for discount, tax, and shipping
    const [discountType, setDiscountType] = useState("amount");
    const [taxType, setTaxType] = useState("amount");
    const [shippingType, setShippingType] = useState("amount");

    useEffect(() => {
        calculateTotal();
    }, [
        itemsArray,
        discountSwitch,
        discountType,
        discount.amount,
        taxSwitch,
        taxType,
        tax.amount,
        shippingSwitch,
        shippingType,
        shipping.cost,
    ]);

    // Calculate Total amount in the invoice
    const calculateTotal = () => {
        const totalSum: number = itemsArray.reduce(
            (sum: number, item: any) => sum + item.total,
            0
        );
        setValue("details.subTotal", totalSum.toString());
        setSubTotal(totalSum);

        let discountAmount: number = parseFloat(discount.amount) ?? 0;
        let taxAmount: number = parseFloat(tax.amount) ?? 0;
        let shippingCost: number = parseFloat(shipping.cost) ?? 0;

        let discountAmountType: string = "amount";
        let taxAmountType: string = "amount";
        let shippingCostType: string = "amount";

        let total: number = totalSum;

        // Check if discountAmount and taxAmount are empty (set to zero) when fully deleted
        if (
            discountAmount === null ||
            discountAmount === undefined ||
            isNaN(discountAmount)
        ) {
            discountAmount = 0;
        }

        if (taxAmount === null || taxAmount === undefined || isNaN(taxAmount)) {
            taxAmount = 0;
        }
        if (
            shippingCost === null ||
            shippingCost === undefined ||
            isNaN(shippingCost)
        ) {
            shippingCost = 0;
        }

        if (discountSwitch) {
            if (discountType == "amount") {
                total -= discountAmount;
                discountAmountType = "amount";
            } else {
                total -= total * (discountAmount / 100);
                discountAmountType = "percentage";
            }
        } else {
            discountAmount = 0;
        }

        if (taxSwitch) {
            if (taxType == "amount") {
                total += taxAmount;
                taxAmountType = "amount";
            } else {
                total += total * (taxAmount / 100);
                taxAmountType = "percentage";
            }
        } else {
            taxAmount = 0;
        }

        if (shippingSwitch) {
            if (shippingType == "amount") {
                total += shippingCost;
                shippingCostType = "amount";
            } else {
                total += total * (shippingCost / 100);
                shippingCostType = "percentage";
            }
        } else {
            shippingCost = 0;
        }

        setTotalAmount(total);
        setValue("details.discountDetails.amount", discountAmount);
        setValue("details.taxDetails.amount", taxAmount);
        setValue("details.shippingDetails.cost", shippingCost);

        setValue("details.discountDetails.amountType", discountAmountType);
        setValue("details.taxDetails.amountType", taxAmountType);
        setValue("details.shippingDetails.costType", shippingCostType);

        setValue("details.totalAmount", total.toString());
    };

    const switchAmountType = (
        type: string,
        setType: (type: string) => void
    ) => {
        if (type == "amount") {
            setType("percentage");
        } else {
            setType("amount");
        }
    };

    return (
        <div className="flex flex-wrap gap-5">
            <div className="flex flex-col gap-3">
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
                                            className="w-[15rem] h-0"
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
                                            className="w-[15rem] h-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col gap-3 min-w-[22rem]">
                <div className="flex justify-center gap-x-10 pb-6">
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
                                                setDiscountSwitch(value);
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
                                                setTaxSwitch(value);
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
                                                setShippingSwitch(value);
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col px-10 justify-around gap-y-3">
                    <div className="flex justify-between items-center">
                        <div>Sub total</div>

                        <div>
                            {formatNumberWithCommas(subTotal)} {currency}
                        </div>
                    </div>
                    {discountSwitch && (
                        <>
                            <div className="flex justify-between items-center">
                                <div>Discount</div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            switchAmountType(
                                                discountType,
                                                setDiscountType
                                            )
                                        }
                                    >
                                        <RefreshCw />
                                    </Button>

                                    <FormField
                                        control={control}
                                        name="details.discountDetails.amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between gap-5 items-center text-sm">
                                                    <div>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-28"
                                                                placeholder="Discount"
                                                                type="number"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    {discountType == "percentage" ? (
                                        <Percent />
                                    ) : (
                                        <div>{currency}</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {taxSwitch && (
                        <>
                            <div className="flex justify-between items-center">
                                <div>Tax</div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            switchAmountType(
                                                taxType,
                                                setTaxType
                                            )
                                        }
                                    >
                                        <RefreshCw />
                                    </Button>

                                    <FormField
                                        control={control}
                                        name="details.taxDetails.amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between gap-5 items-center text-sm">
                                                    <div>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-28"
                                                                placeholder="Tax"
                                                                type="number"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    {taxType == "percentage" ? (
                                        <Percent />
                                    ) : (
                                        <div>{currency}</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {shippingSwitch && (
                        <>
                            <div className="flex justify-between items-center">
                                <div>Shipping</div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            switchAmountType(
                                                shippingType,
                                                setShippingType
                                            )
                                        }
                                    >
                                        <RefreshCw />
                                    </Button>

                                    <FormField
                                        control={control}
                                        name="details.shippingDetails.cost"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between gap-5 items-center text-sm">
                                                    <div>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-28"
                                                                placeholder="Cost"
                                                                type="number"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    {shippingType == "percentage" ? (
                                        <Percent />
                                    ) : (
                                        <div>{currency}</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-center">
                        <div>Total Amount</div>

                        <div>
                            {formatNumberWithCommas(totalAmount)} {currency}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-5">
                <Label>Signature:</Label>
                <SignatureCanvas
                    ref={signatureRef}
                    penColor="rgba(25, 25, 112, 1)"
                    canvasProps={{
                        height: "auto",
                        width: "auto",
                        style: {
                            backgroundColor: "rgba(230, 230, 230, 1)",
                            border: "2px solid black",
                            borderRadius: "10px",
                        },
                    }}
                    onEnd={handleCanvasEnd}
                />
                <Button
                    type="button"
                    onClick={clearSignature}
                    className="w-fit gap-2"
                    variant="destructive"
                >
                    Clear Signature
                </Button>
            </div>
        </div>
    );
};

export default InvoiceFooter;
