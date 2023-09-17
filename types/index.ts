export interface Invoice {
    sender: InvoiceSender;
    receiver: InvoiceReceiver;
    details: InvoiceDetails;
}

export interface InvoiceSender {
    // Sender's information
    senderName: string;
    senderAddress: string;
    senderZipCode: string;
    senderCity: string;
    senderCountry: string;
    senderEmail: string;
    senderPhone: string;
    senderVATNumber?: string;
    // senderCustomFields: Array<any>;
}

export interface InvoiceReceiver {
    receiverName: string;
    receiverAddress: string;
    receiverZipCode: string;
    receiverCity: string;
    receiverCountry: string;
    receiverEmail: string;
    receiverPhone: string;
    receiverVATNumber?: string;
}

export interface Item {
    itemName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface TaxDetails {
    taxRate?: number;
    taxRateType?: 'percentage' | 'amount';
    taxID?: string;
    totalTaxAmount?: number;
}

export interface DiscountDetails {
    discountRate?: number;
    discountRateType?: 'percentage' | 'amount';
}

export interface ShippingDetails {
    shippingCost?: number;
}

export interface InvoiceDetails {
    invoiceNumber: string;
    invoiceDate: string;
    
    // Calendar date when payment is expected
    dueDate: string;

    // Mainly For B2B, but could be present in some B2C cases
    purchaseOrderNumber?: string;

    currency: string;
    language: string;

    // Product or Service
    items: Item[];

    // Total cost of all products or services before taxes
    subTotal: number;

    taxDetails?: TaxDetails;
    discountDetails?: DiscountDetails;
    shippingDetails?: ShippingDetails;

    // Subtotal + total tax amount - total discount amount + shipping cost
    totalAmount: number;

    // Additional notes to be displayed on the invoice
    additionalNotes?: string;

    // Payment expectation in days. 
    // Net 30 - payment is due within 30 days
    // Due on receipt - payment is due immediately upon receipt of the invoice
    paymentTerms: string;
}