import { z } from "zod";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers/client";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

type StringLengthOptions = {
    min?: number;
    max?: number;
    minMessage?: string;
    maxMessage?: string;
};

const withStringLength = (
    schema: z.ZodString,
    { min, max, minMessage, maxMessage }: StringLengthOptions
) => {
    let value = schema;

    if (typeof min === "number") {
        value = value.min(min, {
            message: minMessage ?? `Must be at least ${min} characters`,
        });
    }

    if (typeof max === "number") {
        value = value.max(max, {
            message: maxMessage ?? `Must be at most ${max} characters`,
        });
    }

    return value;
};

// Field Validators
const fieldValidators = {
    name: withStringLength(z.string(), { min: 2, max: 50 }),
    address: withStringLength(z.string(), {
        min: 2,
        max: 70,
        maxMessage: "Must be between 2 and 70 characters",
    }),
    zipCode: withStringLength(z.string(), {
        min: 2,
        max: 20,
        minMessage: "Must be between 2 and 20 characters",
        maxMessage: "Must be between 2 and 20 characters",
    }),
    city: withStringLength(z.string(), {
        min: 1,
        max: 50,
        minMessage: "Must be between 1 and 50 characters",
        maxMessage: "Must be between 1 and 50 characters",
    }),
    country: withStringLength(z.string(), {
        max: 70,
    }).default(""),
    email: withStringLength(
        z.string().email({ message: "Email must be a valid email" }),
        {
            min: 5,
            max: 30,
            minMessage: "Must be between 5 and 30 characters",
            maxMessage: "Must be between 5 and 30 characters",
        }
    ),
    phone: withStringLength(z.string(), {
        min: 1,
        max: 50,
        minMessage: "Must be between 1 and 50 characters",
        maxMessage: "Must be between 1 and 50 characters",
    }),

    // Dates
    date: z
        .date()
        .transform((date) =>
            new Date(date).toLocaleDateString("en-US", DATE_OPTIONS)
        ),

    // Items
    quantity: z.coerce
        .number()
        .gt(0, { message: "Must be a number greater than 0" }),
    unitPrice: z.coerce
        .number()
        .gt(0, { message: "Must be a number greater than 0" })
        .lte(Number.MAX_SAFE_INTEGER, { message: `Must be ≤ ${Number.MAX_SAFE_INTEGER}` }),

    // Strings
    string: z.string(),
    stringMin1: withStringLength(z.string(), { min: 1 }),
    stringToNumber: z.coerce.number(),

    // Charges
    stringToNumberWithMax: z.coerce.number().max(1000000),

    stringOptional: z.string().optional(),

    nonNegativeNumber: z.coerce.number().nonnegative({
        message: "Must be a non-negative number",
    }),
    // ! This is unused
    numWithCommas: z.coerce
        .number()
        .nonnegative({
            message: "Must be a positive number",
        })
        .transform((value) => {
            return formatNumberWithCommas(value);
        }),
};

const CustomInputSchema = z.object({
    key: z.string(),
    value: z.string(),
});

const InvoiceSenderSchema = z.object({
    name: fieldValidators.name,
    address: fieldValidators.address,
    zipCode: fieldValidators.zipCode,
    city: fieldValidators.city,
    country: fieldValidators.country,
    email: fieldValidators.email,
    phone: fieldValidators.phone,
    customInputs: z.array(CustomInputSchema).optional(),
});

const InvoiceReceiverSchema = z.object({
    name: fieldValidators.name,
    address: fieldValidators.address,
    zipCode: fieldValidators.zipCode,
    city: fieldValidators.city,
    country: fieldValidators.country,
    email: fieldValidators.email,
    phone: fieldValidators.phone,
    customInputs: z.array(CustomInputSchema).optional(),
});

const ItemSchema = z.object({
    name: fieldValidators.stringMin1,
    description: fieldValidators.stringOptional,
    quantity: fieldValidators.quantity,
    unitPrice: fieldValidators.unitPrice,
    total: fieldValidators.stringToNumber,
});

const PaymentInformationSchema = z.object({
    bankName: fieldValidators.stringMin1,
    accountName: fieldValidators.stringMin1,
    accountNumber: fieldValidators.stringMin1,
});

const DiscountDetailsSchema = z.object({
    amount: fieldValidators.stringToNumberWithMax,
    amountType: fieldValidators.string,
});

const TaxDetailsSchema = z.object({
    amount: fieldValidators.stringToNumberWithMax,
    taxID: fieldValidators.string,
    amountType: fieldValidators.string,
});

const ShippingDetailsSchema = z.object({
    cost: fieldValidators.stringToNumberWithMax,
    costType: fieldValidators.string,
});

const SignatureSchema = z.object({
    data: fieldValidators.string,
    fontFamily: fieldValidators.string.optional(),
});

const InvoiceDetailsSchema = z.object({
    invoiceLogo: fieldValidators.stringOptional,
    invoiceNumber: fieldValidators.stringMin1,
    invoiceDate: fieldValidators.date,
    dueDate: fieldValidators.date,
    purchaseOrderNumber: fieldValidators.stringOptional,
    currency: fieldValidators.string,
    language: fieldValidators.string,
    items: z.array(ItemSchema),
    paymentInformation: PaymentInformationSchema.optional(),
    taxDetails: TaxDetailsSchema.optional(),
    discountDetails: DiscountDetailsSchema.optional(),
    shippingDetails: ShippingDetailsSchema.optional(),
    subTotal: fieldValidators.nonNegativeNumber,
    totalAmount: fieldValidators.nonNegativeNumber,
    totalAmountInWords: fieldValidators.string,
    additionalNotes: fieldValidators.stringOptional,
    paymentTerms: fieldValidators.stringMin1,
    signature: SignatureSchema.optional(),
    updatedAt: fieldValidators.stringOptional,
    pdfTemplate: z.number(),
});

const InvoiceSchema = z.object({
    sender: InvoiceSenderSchema,
    receiver: InvoiceReceiverSchema,
    details: InvoiceDetailsSchema,
});

export { InvoiceSchema, ItemSchema };
