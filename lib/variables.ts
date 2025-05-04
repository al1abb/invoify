// Types
import { SignatureColor, SignatureFont } from "@/types";

/**
 * Environment
 */
export const ENV = process.env.NODE_ENV;

/**
 * Websites
 */
export const BASE_URL = "https://invoify.vercel.app";
export const AUTHOR_WEBSITE = "https://aliabb.vercel.app";
export const AUTHOR_GITHUB = "https://github.com/al1abb";

/**
 * API endpoints
 */
export const GENERATE_PDF_API = "/api/invoice/generate";
export const SEND_PDF_API = "/api/invoice/send";
export const EXPORT_INVOICE_API = "/api/invoice/export";

/**
 * External API endpoints
 */
export const CURRENCIES_API =
  "https://openexchangerates.org/api/currencies.json";

/**
 * Chromium for Puppeteer
 */
export const CHROMIUM_EXECUTABLE_PATH =
  "https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar";

/**
 * Tailwind
 */
export const TAILWIND_CDN =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/**
 * Google
 */
export const GOOGLE_SC_VERIFICATION = process.env.GOOGLE_SC_VERIFICATION;

/**
 * Nodemailer
 */
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PW = process.env.NODEMAILER_PW;

/**
 * I18N
 */
export const LOCALES = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
];
export const DEFAULT_LOCALE = LOCALES[0].code;

/**
 * Signature variables
 */
export const SIGNATURE_COLORS: SignatureColor[] = [
  { name: "black", label: "Black", color: "rgb(0, 0, 0)" },
  { name: "dark blue", label: "Dark Blue", color: "rgb(0, 0, 128)" },
  {
    name: "crimson",
    label: "Crimson",
    color: "#DC143C",
  },
];

export const SIGNATURE_FONTS: SignatureFont[] = [
  {
    name: "Dancing Script",
    variable: "var(--font-dancing-script)",
  },
  { name: "Parisienne", variable: "var(--font-parisienne)" },
  {
    name: "Great Vibes",
    variable: "var(--font-great-vibes)",
  },
  {
    name: "Alex Brush",
    variable: "var(--font-alex-brush)",
  },
];

/**
 * Form date options
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
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
    currency: "AED",
    language: "English",
    taxDetails: {
      amount: 0,
      amountType: "percentage",
      taxID: "",
    },
    advancePaymentDetails: {
      amount: 0,
      amountType: "amount",
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
      bankName: "Abu Dhabi Islamic Bank (ADIB)",
      accountName: "Brandvibe Digital Marketing Services Est",
      accountClass: "Current Account",
      accountNumber: "19380062",
      iban: "AE500500000000019380062",
    },
    additionalNotes: "",
    paymentTerms:
      "Please use the following bank details for your payment. Ensure to mention your invoice number in the reference and send us the payment confirmation for verification.",
    totalAmountInWords: "",
    pdfTemplate: 0,
  },
};

/**
 * ? DEV Only
 * Form auto fill values for testing
 */
export const FORM_FILL_VALUES = {
  sender: {
    name: "John Doe",
    address: "123 Main St",
    zipCode: "12345",
    city: "Anytown",
    country: "USA",
    email: "johndoe@example.com",
    phone: "123-456-7890",
  },
  receiver: {
    name: "Jane Smith",
    address: "456 Elm St",
    website: "https://example.com",
    zipCode: "54321",
    city: "Other Town",
    country: "Canada",
    email: "janesmith@example.com",
    phone: "987-654-3210",
  },
  details: {
    invoiceLogo: "",
    invoiceNumber: "INV0001",
    quotationNumber: "QTN0001",
    salesPerson: "Hamdan",
    invoiceDate: new Date(),
    dueDate: new Date(),
    items: [
      {
        name: "Product 1",
        quantity: 4,
        unitPrice: 50,
        total: 200,
      },
      {
        name: "Product 2",
        quantity: 5,
        unitPrice: 50,
        total: 250,
      },
      {
        name: "Product 3",
        quantity: 5,
        unitPrice: 80,
        total: 400,
      },
    ],
    currency: "AED",
    language: "English",
    taxDetails: {
      amount: 15,
      amountType: "percentage",
      taxID: "987654321",
    },
    advancePaymentDetails: {
      amount: 5,
      amountType: "percentage",
    },
    discountDetails: {
      amount: 5,
      amountType: "percentage",
    },
    shippingDetails: {
      cost: 5,
      costType: "percentage",
    },
    paymentInformation: {
      bankName: "Abu Dhabi Islamic Bank (ADIB)",
      accountName: "Brandvibe Digital Marketing Services Est",
      accountClass: "Current Account",
      accountNumber: "19380062",
      iban: "AE500500000000019380062",
    },
    paymentTerms:
      "Please use the following bank details for your payment. Ensure to mention your invoice number in the reference and send us the payment confirmation for verification.",
    signature: {
      data: "",
    },
    subTotal: "850",
    totalAmount: "850",
    totalAmountInWords: "Eight Hundred Fifty",
    pdfTemplate: 0,
  },
};
