import { boolean, z } from "zod";

const ItemSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.coerce.number(),
    unitPrice: z.coerce.number(),
    total: z.coerce.number(),
});

const TaxDetailsSchema = z.object({
    amount: z.coerce.number(),
    taxID: z.string().optional(),
    totalTaxAmount: z.coerce.number(),
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
    bankName: z.string(),
    accountName: z.string(),
    accountNumber: z.string(),
})

const InvoiceDetailsSchema = z.object({
    invoiceLogo: z.unknown(),
    invoiceNumber: z.string(),
    invoiceDate: z.string(),
    dueDate: z.string(),
    purchaseOrderNumber: z.string().optional(),
    currency: z.string(),
    language: z.string(),
    items: z.array(ItemSchema),
    taxDetails: TaxDetailsSchema.optional(),
    discountDetails: DiscountDetailsSchema.optional(),
    shippingDetails: ShippingDetailsSchema.optional(),
    subTotal: z.coerce.number(),
    totalAmount: z.coerce.number(),
    additionalNotes: z.string().optional(),
    paymentTerms: z.string(),
    signature: z.string().optional(),
    paymentInformation: PaymentInformationSchema.optional(),
});

const InvoiceSenderSchema = z.object({
    name: z.string().min(2).max(50),
    address: z.string(),
    zipCode: z.string(),
    city: z.string(),
    country: z.string(),
    email: z.string(),
    phone: z.string(),
    vatNumber: z.string().optional(),
});

const InvoiceReceiverSchema = z.object({
    name: z.string(),
    address: z.string(),
    zipCode: z.string(),
    city: z.string(),
    country: z.string(),
    email: z.string(),
    phone: z.string(),
    vatNumber: z.string().optional(),
});

const InvoiceSchema = z.object({
    sender: InvoiceSenderSchema,
    receiver: InvoiceReceiverSchema,
    details: InvoiceDetailsSchema,
});

export { InvoiceSchema };
