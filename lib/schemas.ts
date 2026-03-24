import { z } from "zod";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { SettingsType } from "@/types";

// TODO: Refactor some of the validators. Ex: name and zipCode or address and country have same rules
// Field Validators
const fieldValidators = {
    name: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(50, { message: "Must be at most 50 characters" }),
    address: z
        .string()
        .min(2, { message: "Must be at least 2 characters" })
        .max(70, { message: "Must be between 2 and 70 characters" }),
    zipCode: z
        .string()
        .min(2, { message: "Must be between 2 and 20 characters" })
        .max(20, { message: "Must be between 2 and 20 characters" }),
    city: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, { message: "Must be between 1 and 50 characters" }),
    country: z
        .string()
        .min(1, { message: "Must be between 1 and 70 characters" })
        .max(70, { message: "Must be between 1 and 70 characters" }),
    email: z
        .string()
        .email({ message: "Email must be a valid email" })
        .min(5, { message: "Must be between 5 and 30 characters" })
        .max(30, { message: "Must be between 5 and 30 characters" }),
    phone: z
        .string()
        .min(1, { message: "Must be between 1 and 50 characters" })
        .max(50, {
            message: "Must be between 1 and 50 characters",
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
    stringMin1: z.string().min(1, { message: "Must be at least 1 character" }),
    stringToNumber: z.coerce.number(),

    // Charges
    stringToNumberWithMax: z.coerce.number().max(1000000),

    stringOptional: z.string().optional(),

    nonNegativeNumber: z.coerce.number().nonnegative({
        message: "Must be a positive number",
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

// Helper: converts empty string to undefined so optional validators pass
const makeOptional = (validator: z.ZodTypeAny) =>
    z.preprocess((v) => (v === "" ? undefined : v), validator.optional());

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
    // Optional fields that may be enabled via settings
    sku: fieldValidators.stringOptional,
    discount: fieldValidators.nonNegativeNumber.optional(),
    discountType: fieldValidators.stringOptional,
    tax: fieldValidators.nonNegativeNumber.optional(),
    taxType: fieldValidators.stringOptional,
});

const PaymentInformationSchema = z.object({
    bankName: fieldValidators.stringMin1.optional(),
    accountName: fieldValidators.stringMin1.optional(),
    accountNumber: fieldValidators.stringMin1.optional(),
    // Optional fields for cash payment mode
    isCash: z.boolean().optional(),
    change: fieldValidators.nonNegativeNumber.optional(),
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

// Factory function to create dynamic ItemSchema based on settings
const createItemSchema = (settings: SettingsType) => {
    let schema = z.object({
        name: fieldValidators.stringMin1,
        description: fieldValidators.stringOptional,
        quantity: fieldValidators.quantity,
        unitPrice: fieldValidators.unitPrice,
        total: fieldValidators.stringToNumber,
    });

    // Add SKU field if enabled
    if (settings.skuColumn.enabled) {
        const skuValidator = settings.skuColumn.required
            ? fieldValidators.stringMin1
            : fieldValidators.stringOptional;
        schema = schema.extend({
            sku: skuValidator,
        });
    }

    // Add discount field if enabled
    if (settings.discountPerItem.enabled) {
        const discountValidator = settings.discountPerItem.required
            ? fieldValidators.nonNegativeNumber
            : fieldValidators.nonNegativeNumber.optional();
        schema = schema.extend({
            discount: discountValidator,
            discountType: fieldValidators.stringOptional,
        });
    }

    // Add tax field if enabled
    if (settings.taxPerItem.enabled) {
        const taxValidator = settings.taxPerItem.required
            ? fieldValidators.nonNegativeNumber
            : fieldValidators.nonNegativeNumber.optional();
        schema = schema.extend({
            tax: taxValidator,
            taxType: fieldValidators.stringOptional,
        });
    }

    return schema;
};

// Factory function to create dynamic PaymentInformationSchema based on settings
const createPaymentInformationSchema = (settings: SettingsType) => {
    if (settings.cashPaymentMode.enabled) {
        return z
            .object({
                // Use makeOptional so empty strings "" become undefined and pass when cash is ON
                bankName: makeOptional(fieldValidators.stringMin1),
                accountName: makeOptional(fieldValidators.stringMin1),
                accountNumber: makeOptional(fieldValidators.stringMin1),
                isCash: z.boolean().optional(),
                change: fieldValidators.nonNegativeNumber.optional(),
            })
            .superRefine((data, ctx) => {
                // Only validate bank fields when NOT using cash payment
                if (!data.isCash) {
                    if (!data.bankName) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Bank name required when not using cash payment",
                            path: ["bankName"],
                        });
                    }
                    if (!data.accountName) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Account name required when not using cash payment",
                            path: ["accountName"],
                        });
                    }
                    if (!data.accountNumber) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Account number required when not using cash payment",
                            path: ["accountNumber"],
                        });
                    }
                }
            });
    }

    return z.object({
        bankName: fieldValidators.stringMin1,
        accountName: fieldValidators.stringMin1,
        accountNumber: fieldValidators.stringMin1,
    });
};

// Factory function to create dynamic sender schema based on settings
const createSenderSchema = (settings: SettingsType) => {
    const emailValidator = settings.fieldRequirements.senderEmail === "required"
        ? fieldValidators.email
        : makeOptional(fieldValidators.email);

    const phoneValidator = settings.fieldRequirements.senderPhone === "required"
        ? fieldValidators.phone
        : makeOptional(fieldValidators.phone);

    const addressValidator = settings.fieldRequirements.senderAddress === "required"
        ? fieldValidators.address
        : makeOptional(fieldValidators.address);

    const zipCodeValidator = settings.fieldRequirements.senderZipCode === "required"
        ? fieldValidators.zipCode
        : makeOptional(fieldValidators.zipCode);

    const cityValidator = settings.fieldRequirements.senderCity === "required"
        ? fieldValidators.city
        : makeOptional(fieldValidators.city);

    const countryValidator = settings.fieldRequirements.senderCountry === "required"
        ? fieldValidators.country
        : makeOptional(fieldValidators.country);

    return z.object({
        name: fieldValidators.name,
        address: addressValidator,
        zipCode: zipCodeValidator,
        city: cityValidator,
        country: countryValidator,
        email: emailValidator,
        phone: phoneValidator,
        customInputs: z.array(CustomInputSchema).optional(),
    });
};

// Factory function to create dynamic receiver schema based on settings
const createReceiverSchema = (settings: SettingsType) => {
    const emailValidator = settings.fieldRequirements.receiverEmail === "required"
        ? fieldValidators.email
        : makeOptional(fieldValidators.email);

    const phoneValidator = settings.fieldRequirements.receiverPhone === "required"
        ? fieldValidators.phone
        : makeOptional(fieldValidators.phone);

    const addressValidator = settings.fieldRequirements.receiverAddress === "required"
        ? fieldValidators.address
        : makeOptional(fieldValidators.address);

    const zipCodeValidator = settings.fieldRequirements.receiverZipCode === "required"
        ? fieldValidators.zipCode
        : makeOptional(fieldValidators.zipCode);

    const cityValidator = settings.fieldRequirements.receiverCity === "required"
        ? fieldValidators.city
        : makeOptional(fieldValidators.city);

    const countryValidator = settings.fieldRequirements.receiverCountry === "required"
        ? fieldValidators.country
        : makeOptional(fieldValidators.country);

    return z.object({
        name: fieldValidators.name,
        address: addressValidator,
        zipCode: zipCodeValidator,
        city: cityValidator,
        country: countryValidator,
        email: emailValidator,
        phone: phoneValidator,
        customInputs: z.array(CustomInputSchema).optional(),
    });
};

// Factory function to create dynamic InvoiceDetailsSchema based on settings
const createInvoiceDetailsSchema = (settings: SettingsType) => {
    return z.object({
        invoiceLogo: fieldValidators.stringOptional,
        invoiceNumber: fieldValidators.stringMin1,
        invoiceDate: fieldValidators.date,
        dueDate: fieldValidators.date,
        purchaseOrderNumber: fieldValidators.stringOptional,
        currency: fieldValidators.string,
        language: fieldValidators.string,
        items: z.array(createItemSchema(settings)),
        paymentInformation: createPaymentInformationSchema(settings).optional(),
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
};

// Factory function to create dynamic InvoiceSchema based on settings
const createInvoiceSchema = (settings: SettingsType) => {
    return z.object({
        sender: createSenderSchema(settings),
        receiver: createReceiverSchema(settings),
        details: createInvoiceDetailsSchema(settings),
    });
};

export { InvoiceSchema, ItemSchema, createInvoiceSchema, createItemSchema, createPaymentInformationSchema, createSenderSchema, createReceiverSchema, createInvoiceDetailsSchema };
