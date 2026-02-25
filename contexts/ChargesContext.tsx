"use client";

import React, {
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Helpers
import { formatPriceToString } from "@/lib/helpers/currency";

// Types
import { InvoiceType, ItemType } from "@/types";

const defaultChargesContext = {
    discountSwitch: false,
    setDiscountSwitch: (_newValue: boolean) => {},
    taxSwitch: false,
    setTaxSwitch: (_newValue: boolean) => {},
    shippingSwitch: false,
    setShippingSwitch: (_newValue: boolean) => {},
    discountType: "amount",
    setDiscountType: (_newValue: SetStateAction<string>) => {},
    taxType: "amount",
    setTaxType: (_newValue: SetStateAction<string>) => {},
    shippingType: "amount",
    setShippingType: (_newValue: SetStateAction<string>) => {},
    totalInWordsSwitch: true,
    setTotalInWordsSwitch: (_newValue: boolean) => {},
    currency: "USD",
    subTotal: 0,
    totalAmount: 0,
    calculateTotal: () => {},
};

const normalizeChargeType = (value: unknown): "amount" | "percentage" => {
    return value === "percentage" ? "percentage" : "amount";
};

const resolveNextChargeType = (
    value: SetStateAction<string>,
    current: "amount" | "percentage"
): "amount" | "percentage" => {
    const nextValue = typeof value === "function" ? value(current) : value;
    return normalizeChargeType(nextValue);
};

export const ChargesContext = createContext(defaultChargesContext);

export const useChargesContext = () => {
    return useContext(ChargesContext);
};

type ChargesContextProps = {
    children: React.ReactNode;
};

export const ChargesContextProvider = ({ children }: ChargesContextProps) => {
    const { control, getValues, setValue } = useFormContext<InvoiceType>();

    // Form Fields
    const itemsArray = useWatch({
        name: `details.items`,
        control,
    });

    const currency = useWatch({
        name: `details.currency`,
        control,
    });

    // Charges
    const charges = {
        discount: useWatch({ name: `details.discountDetails`, control }) || {
            amount: 0,
            amountType: "amount",
        },
        tax: useWatch({ name: `details.taxDetails`, control }) || {
            amount: 0,
            amountType: "amount",
        },
        shipping: useWatch({ name: `details.shippingDetails`, control }) || {
            cost: 0,
            costType: "amount",
        },
    };

    const { discount, tax, shipping } = charges;
    const discountAmountInput = discount?.amount;
    const taxAmountInput = tax?.amount;
    const shippingCostInput = shipping?.cost;

    // Switch states. On/Off
    const [discountSwitch, setDiscountSwitch] = useState<boolean>(
        discount?.amount ? true : false
    );
    const [taxSwitch, setTaxSwitch] = useState<boolean>(
        tax?.amount ? true : false
    );
    const [shippingSwitch, setShippingSwitch] = useState<boolean>(
        shipping?.cost ? true : false
    );

    // ? Old approach of using totalInWords variable
    // totalInWords ? true : false
    const [totalInWordsSwitch, setTotalInWordsSwitch] = useState<boolean>(true);

    // Initial subtotal and total
    const [subTotal, setSubTotal] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    // Types for discount, tax, and shipping. Amount | Percentage
    const discountType = normalizeChargeType(discount?.amountType);
    const taxType = normalizeChargeType(tax?.amountType);
    const shippingType = normalizeChargeType(shipping?.costType);

    const setDiscountType = useCallback(
        (newValue: SetStateAction<string>) => {
            const current = normalizeChargeType(
                getValues("details.discountDetails.amountType")
            );
            const next = resolveNextChargeType(newValue, current);
            setValue("details.discountDetails.amountType", next);
        },
        [getValues, setValue]
    );

    const setTaxType = useCallback(
        (newValue: SetStateAction<string>) => {
            const current = normalizeChargeType(getValues("details.taxDetails.amountType"));
            const next = resolveNextChargeType(newValue, current);
            setValue("details.taxDetails.amountType", next);
        },
        [getValues, setValue]
    );

    const setShippingType = useCallback(
        (newValue: SetStateAction<string>) => {
            const current = normalizeChargeType(
                getValues("details.shippingDetails.costType")
            );
            const next = resolveNextChargeType(newValue, current);
            setValue("details.shippingDetails.costType", next);
        },
        [getValues, setValue]
    );

    /**
     * Calculates the subtotal, total, and the total amount in words on the invoice.
     */
    const calculateTotal = useCallback(() => {
        // Here Number(item.total) fixes a bug where an extra zero appears
        // at the beginning of subTotal caused by toFixed(2) in item.total in single item
        // Reason: toFixed(2) returns string, not a number instance
        const totalSum: number = itemsArray.reduce(
            (sum: number, item: ItemType) => sum + Number(item.total),
            0
        );

        setValue("details.subTotal", totalSum);
        setSubTotal(totalSum);

        let discountAmount: number =
            parseFloat(discountAmountInput?.toString() ?? "0") ?? 0;
        let taxAmount: number =
            parseFloat(taxAmountInput?.toString() ?? "0") ?? 0;
        let shippingCost: number =
            parseFloat(shippingCostInput?.toString() ?? "0") ?? 0;

        let total: number = totalSum;

        if (!isNaN(discountAmount)) {
            if (discountType == "amount") {
                total -= discountAmount;
            } else {
                total -= total * (discountAmount / 100);
            }
            setValue("details.discountDetails.amount", discountAmount);
        }

        if (!isNaN(taxAmount)) {
            if (taxType == "amount") {
                total += taxAmount;
            } else {
                total += total * (taxAmount / 100);
            }
            setValue("details.taxDetails.amount", taxAmount);
        }

        if (!isNaN(shippingCost)) {
            if (shippingType == "amount") {
                total += shippingCost;
            } else {
                total += total * (shippingCost / 100);
            }
            setValue("details.shippingDetails.cost", shippingCost);
        }

        setTotalAmount(total);

        setValue("details.totalAmount", total);
        
        if (totalInWordsSwitch) {
            setValue("details.totalAmountInWords", formatPriceToString(total, currency));
        } else {
            setValue("details.totalAmountInWords", "");
        }
    }, [
        currency,
        discountAmountInput,
        discountType,
        itemsArray,
        setValue,
        shippingCostInput,
        shippingType,
        taxAmountInput,
        taxType,
        totalInWordsSwitch,
    ]);

    // Normalize legacy or malformed charge type fields from persisted drafts.
    useEffect(() => {
        const normalizedDiscountType = normalizeChargeType(discount?.amountType);
        const normalizedTaxType = normalizeChargeType(tax?.amountType);
        const normalizedShippingType = normalizeChargeType(shipping?.costType);

        if (discount?.amountType !== normalizedDiscountType) {
            setValue("details.discountDetails.amountType", normalizedDiscountType);
        }

        if (tax?.amountType !== normalizedTaxType) {
            setValue("details.taxDetails.amountType", normalizedTaxType);
        }

        if (shipping?.costType !== normalizedShippingType) {
            setValue("details.shippingDetails.costType", normalizedShippingType);
        }
    }, [
        discount?.amountType,
        shipping?.costType,
        tax?.amountType,
        setValue,
    ]);

    // When loading invoice, if received values, turn on the switches.
    useEffect(() => {
        setDiscountSwitch(Boolean(discount?.amount));
        setTaxSwitch(Boolean(tax?.amount));
        setShippingSwitch(Boolean(shipping?.cost));
    }, [discount?.amount, shipping?.cost, tax?.amount]);

    // Check switches, if off set values to zero
    useEffect(() => {
        if (!discountSwitch) {
            setValue("details.discountDetails.amount", 0);
        }

        if (!taxSwitch) {
            setValue("details.taxDetails.amount", 0);
        }

        if (!shippingSwitch) {
            setValue("details.shippingDetails.cost", 0);
        }
    }, [discountSwitch, shippingSwitch, taxSwitch, setValue]);

    // Calculate total when values change
    useEffect(() => {
        calculateTotal();
    }, [calculateTotal]);

    return (
        <ChargesContext.Provider
            value={{
                discountSwitch,
                setDiscountSwitch,
                taxSwitch,
                setTaxSwitch,
                shippingSwitch,
                setShippingSwitch,
                discountType,
                setDiscountType,
                taxType,
                setTaxType,
                shippingType,
                setShippingType,
                totalInWordsSwitch,
                setTotalInWordsSwitch,
                currency,
                subTotal,
                totalAmount,
                calculateTotal,
            }}
        >
            {children}
        </ChargesContext.Provider>
    );
};
