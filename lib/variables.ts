export const PDF_API = process.env.NEXT_PUBLIC_PDF_API;
export const CURRENCIES = process.env.NEXT_PUBLIC_CURRENCIES_API;

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

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
            taxID: "",
            totalTaxAmount: 0,
        },
        discountDetails: {
            amount: 0,
        },
        shippingDetails: {
            cost: 0,
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
