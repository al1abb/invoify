/**
 * API endpoints
 */
export const GENERATE_PDF_API = "/api/pdf/generate";
export const SEND_PDF_API = "/api/pdf/send";

/**
 * External API endpoints
 */
export const CURRENCIES = "https://openexchangerates.org/api/currencies.json";

/**
 * Nodemailer variables
 */
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PW = process.env.NODEMAILER_PW;

/**
 * Form date options
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

/**
 * Form defaults
 */
export const FORM_DEFAULT_VALUES = {
    sender: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        vatNumber: "",
        customInputs: [],
    },
    receiver: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        vatNumber: "",
        customInputs: [],
    },
    details: {
        invoiceLogo: "",
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        items: [
            {
                name: "",
                description: "",
                quantity: 0,
                unitPrice: 0,
                total: 0,
            },
        ],
        currency: "USD",
        language: "English",
        taxDetails: {
            amount: 0,
            amountType: "amount",
            taxID: "",
        },
        discountDetails: {
            amount: 0,
            amountType: "amount",
        },
        shippingDetails: {
            cost: 0,
            costType: "amount",
        },
        paymentInformation: {
            bankName: "",
            accountName: "",
            accountNumber: "",
        },
        additionalNotes: "",
        paymentTerms: "",
    },
};

/**
 * Form auto fill values for testing
 */
export const FORM_FILL_VALUES = {
    sender: {
        name: "John Doe",
        address: "123 Main St",
        zipCode: "12345",
        city: "Anytown",
        country: "USA",
        email: "gKp8w@example.com",
        phone: "123-456-7890",
        vatNumber: "123456789",
    },
    receiver: {
        name: "Jane Doe",
        address: "123 Main St",
        zipCode: "12345",
        city: "Anytown",
        country: "USA",
        email: "gKp8w@example.com",
        phone: "123-456-7890",
        vatNumber: "123456789",
    },
    details: {
        invoiceLogo: "",
        invoiceNumber: "123456789",
        invoiceDate: new Date(),
        dueDate: new Date(),
        items: [
            {
                name: "Item 1",
                description: "Description 1",
                quantity: 1,
                unitPrice: 100,
                total: 100,
            },
        ],
        currency: "USD",
        language: "English",
        taxDetails: {
            amount: 10,
            amountType: "percentage",
            taxID: "123456789",
        },
        discountDetails: {
            amount: 10,
            amountType: "percentage",
        },
        shippingDetails: {
            cost: 10,
            costType: "percentage",
        },
        paymentInformation: {
            bankName: "Bank Inc.",
            accountName: "John Doe",
            accountNumber: "445566998877",
        },
        additionalNotes: "Thanks for business",
        paymentTerms: "Net 30",
    },
};
