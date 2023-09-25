import { boolean, z } from "zod";

const ItemSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.coerce.number(),
    unitPrice: z.coerce.number(),
    total: z.coerce.number(),
});

const TaxDetailsSchema = z.object({
    amount: z.coerce.number().optional(),
    taxID: z.string().optional(),
    totalTaxAmount: z.coerce.number().optional(),
    amountType: z.string().optional(),
});

const DiscountDetailsSchema = z.object({
    amount: z.coerce.number().optional(),
    amountType: z.string().optional(),
});

const ShippingDetailsSchema = z.object({
    cost: z.coerce.number().optional(),
    costType: z.string().optional(),
});

const InvoiceDetailsSchema = z.object({
    invoiceLogo: z.unknown(),
    invoiceNumber: z.string(),
    invoiceDate: z.date(),
    dueDate: z.date(),
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
