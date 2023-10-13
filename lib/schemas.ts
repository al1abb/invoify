import { z } from "zod";

// Formatter
import { formatNumberWithCommas } from "./formatter";

// Variables
import { DATE_OPTIONS } from "./variables";

const ItemSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1),
    unitPrice: z.coerce.number().min(1),
    total: z.coerce.number(),
});

const TaxDetailsSchema = z.object({
    amount: z.coerce.number(),
    taxID: z.string(),
    amountType: z.string(),
});

const DiscountDetailsSchema = z.object({
    amount: z.coerce.number(),
    amountType: z.string(),
});

const ShippingDetailsSchema = z.object({
    cost: z.coerce.number(),
    costType: z.string(),
});

const PaymentInformationSchema = z.object({
    bankName: z.string().min(1),
    accountName: z.string().min(1),
    accountNumber: z.string().min(1),
});

const InvoiceDetailsSchema = z.object({
    invoiceLogo: z.unknown(),
    invoiceNumber: z.string().min(1),
    invoiceDate: z
        .date()
        .transform((date) =>
            new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)
        ),
    dueDate: z
        .date()
        .transform((date) =>
            new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)
        ),
    purchaseOrderNumber: z.string().optional(),
    currency: z.string(),
    language: z.string(),
    items: z.array(ItemSchema),
    taxDetails: TaxDetailsSchema.optional(),
    discountDetails: DiscountDetailsSchema.optional(),
    shippingDetails: ShippingDetailsSchema.optional(),
    subTotal: z.coerce.number().transform((value) => {
        return formatNumberWithCommas(value);
    }),
    totalAmount: z.coerce.number().transform((value) => {
        return formatNumberWithCommas(value);
    }),
    additionalNotes: z.string().optional(),
    paymentTerms: z.string().min(1),
    signature: z.string().optional(),
    paymentInformation: PaymentInformationSchema.optional(),
});

const InvoiceSenderSchema = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(2).max(70),
    zipCode: z.string().min(2).max(20),
    city: z.string().min(1).max(50),
    country: z.string().min(1).max(70),
    email: z.string().email().min(5).max(30),
    phone: z.string().min(1).max(50),
    vatNumber: z.string().optional(),
});

const InvoiceReceiverSchema = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(2).max(70),
    zipCode: z.string().min(2).max(20),
    city: z.string().min(1).max(20),
    country: z.string().min(1).max(70),
    email: z.string().email().min(5).max(30),
    phone: z.string().min(1).max(50),
    vatNumber: z.string().optional(),
});

const InvoiceSchema = z.object({
    sender: InvoiceSenderSchema,
    receiver: InvoiceReceiverSchema,
    details: InvoiceDetailsSchema,
});

export { InvoiceSchema };
