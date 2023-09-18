import { z } from "zod";

const ItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
});

const TaxDetailsSchema = z.object({
  taxRate: z.number().optional(),
  taxRateType: z.enum(["percentage", "amount"]).optional(),
  taxID: z.string().optional(),
  totalTaxAmount: z.number().optional(),
});

const DiscountDetailsSchema = z.object({
  discountRate: z.number().optional(),
  discountRateType: z.enum(["percentage", "amount"]).optional(),
});

const ShippingDetailsSchema = z.object({
  shippingCost: z.number().optional(),
});

const InvoiceDetailsSchema = z.object({
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  purchaseOrderNumber: z.string().optional(),
  currency: z.string(),
  language: z.string(),
  items: z.array(ItemSchema),
  subTotal: z.number(),
  taxDetails: TaxDetailsSchema.optional(),
  discountDetails: DiscountDetailsSchema.optional(),
  shippingDetails: ShippingDetailsSchema.optional(),
  totalAmount: z.number(),
  additionalNotes: z.string().optional(),
  paymentTerms: z.string(),
});

const InvoiceSenderSchema = z.object({
  name: z.string(),
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
});

export { InvoiceSchema };