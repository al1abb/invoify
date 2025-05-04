"use client";

import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Helpers
import { formatPriceToString } from "@/lib/helpers";

// Types
import { InvoiceType, ItemType } from "@/types";

const defaultChargesContext = {
  advancePaymentSwitch: false,
  setAdvancePaymentSwitch: (newValue: boolean) => {},
  discountSwitch: false,
  setDiscountSwitch: (newValue: boolean) => {},
  taxSwitch: false,
  setTaxSwitch: (newValue: boolean) => {},
  shippingSwitch: false,
  setShippingSwitch: (newValue: boolean) => {},
  advancePaymentType: "amount",
  setAdvancePaymentType: (newValue: SetStateAction<string>) => {},
  discountType: "amount",
  setDiscountType: (newValue: SetStateAction<string>) => {},
  taxType: "amount",
  setTaxType: (newValue: SetStateAction<string>) => {},
  shippingType: "amount",
  setShippingType: (newValue: SetStateAction<string>) => {},
  totalInWordsSwitch: true,
  setTotalInWordsSwitch: (newValue: boolean) => {},
  currency: "AED",
  subTotal: 0,
  totalAmount: 0,
  calculateTotal: () => {},
};

export const ChargesContext = createContext(defaultChargesContext);

export const useChargesContext = () => {
  return useContext(ChargesContext);
};

type ChargesContextProps = {
  children: React.ReactNode;
};

export const ChargesContextProvider = ({ children }: ChargesContextProps) => {
  const { control, setValue, getValues } = useFormContext<InvoiceType>();

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
    advancePayment: useWatch({
      name: `details.advancePaymentDetails`,
      control,
    }) || {
      amount: 0,
      amountType: "amount",
    },
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

  const { advancePayment, discount, tax, shipping } = charges;

  // Switch states. On/Off
  const [advancePaymentSwitch, setAdvancePaymentSwitch] = useState<boolean>(
    advancePayment?.amount ? true : false
  );

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
  const [advancePaymentType, setAdvancePaymentType] = useState("amount");
  const [discountType, setDiscountType] = useState("amount");
  const [taxType, setTaxType] = useState("amount");
  const [shippingType, setShippingType] = useState("amount");

  // When loading invoice, if received values, turn on the switches
  useEffect(() => {
    if (advancePayment?.amount) {
      setAdvancePaymentSwitch(true);
    }

    if (discount?.amount) {
      setDiscountSwitch(true);
    }

    if (tax?.amount) {
      setTaxSwitch(true);
    }

    if (shipping?.cost) {
      setShippingSwitch(true);
    }

    if (advancePayment?.amountType == "amount") {
      setAdvancePaymentType("amount");
    } else {
      setAdvancePaymentType("percentage");
    }

    if (discount?.amountType == "amount") {
      setDiscountType("amount");
    } else {
      setDiscountType("percentage");
    }

    if (tax?.amountType == "amount") {
      setTaxType("amount");
    } else {
      setTaxType("percentage");
    }

    if (shipping?.costType == "amount") {
      setShippingType("amount");
    } else {
      setShippingType("percentage");
    }
  }, [discount?.amount, tax?.amount, shipping?.cost]);

  // Check switches, if off set values to zero
  useEffect(() => {
    if (!advancePaymentSwitch) {
      setValue("details.advancePaymentDetails.amount", 0);
    }

    if (!discountSwitch) {
      setValue("details.discountDetails.amount", 0);
    }

    if (!taxSwitch) {
      setValue("details.taxDetails.amount", 0);
    }

    if (!shippingSwitch) {
      setValue("details.shippingDetails.cost", 0);
    }
  }, [advancePaymentSwitch, discountSwitch, taxSwitch, shippingSwitch]);

  // Calculate total when values change
  useEffect(() => {
    calculateTotal();
  }, [
    itemsArray,
    totalInWordsSwitch,
    advancePaymentType,
    advancePayment?.amount,
    discountType,
    discount?.amount,
    taxType,
    tax?.amount,
    shippingType,
    shipping?.cost,
    currency,
  ]);

  /**
   * Calculates the subtotal, total, and the total amount in words on the invoice.
   */
  const calculateTotal = () => {
    // Here Number(item.total) fixes a bug where an extra zero appears
    // at the beginning of subTotal caused by toFixed(2) in item.total in single item
    // Reason: toFixed(2) returns string, not a number instance
    const totalSum: number = itemsArray.reduce(
      (sum: number, item: ItemType) => sum + Number(item.total),
      0
    );

    setValue("details.subTotal", totalSum);
    setSubTotal(totalSum);

    let advancePaymentAmount =
      parseFloat(advancePayment!.amount.toString()) ?? 0;
    let discountAmount = parseFloat(discount!.amount.toString()) ?? 0;
    let taxAmount = parseFloat(tax!.amount.toString()) ?? 0;
    let shippingCost = parseFloat(shipping!.cost.toString()) ?? 0;

    let advancePaymentAmountType = "amount";
    let discountAmountType = "amount";
    let taxAmountType = "amount";
    let shippingCostType = "amount";

    let total = totalSum;

    if (!isNaN(advancePaymentAmount)) {
      if (advancePaymentType == "amount") {
        total -= advancePaymentAmount;
        advancePaymentAmountType = "amount";
      } else {
        total -= total * (advancePaymentAmount / 100);
        advancePaymentAmountType = "percentage";
      }
      setValue("details.advancePaymentDetails.amount", advancePaymentAmount);
    }

    if (!isNaN(discountAmount)) {
      if (discountType == "amount") {
        total -= discountAmount;
        discountAmountType = "amount";
      } else {
        total -= total * (discountAmount / 100);
        discountAmountType = "percentage";
      }
      setValue("details.discountDetails.amount", discountAmount);
    }

    if (!isNaN(taxAmount)) {
      if (taxType == "amount") {
        total += taxAmount;
        taxAmountType = "amount";
      } else {
        total += total * (taxAmount / 100);
        taxAmountType = "percentage";
      }
      setValue("details.taxDetails.amount", taxAmount);
    }

    if (!isNaN(shippingCost)) {
      if (shippingType == "amount") {
        total += shippingCost;
        shippingCostType = "amount";
      } else {
        total += total * (shippingCost / 100);
        shippingCostType = "percentage";
      }
      setValue("details.shippingDetails.cost", shippingCost);
    }

    setTotalAmount(total);

    setValue("details.advancePaymentDetails.amountType", advancePaymentType);
    setValue("details.discountDetails.amountType", discountAmountType);
    setValue("details.taxDetails.amountType", taxAmountType);
    setValue("details.shippingDetails.costType", shippingCostType);

    setValue("details.totalAmount", total);

    if (totalInWordsSwitch) {
      setValue(
        "details.totalAmountInWords",
        formatPriceToString(total, getValues("details.currency"))
      );
    } else {
      setValue("details.totalAmountInWords", "");
    }
  };

  return (
    <ChargesContext.Provider
      value={{
        advancePaymentSwitch,
        setAdvancePaymentSwitch,
        discountSwitch,
        setDiscountSwitch,
        taxSwitch,
        setTaxSwitch,
        shippingSwitch,
        setShippingSwitch,
        advancePaymentType,
        setAdvancePaymentType,
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
