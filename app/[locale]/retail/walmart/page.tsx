"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Walmart template data
const walmartTemplate = {
    storeName: "Walmart",
    storeAddress: "3451 TRUXEL RD, SACRAMENTO CA 23456",
    phone: "(915) 968-2258",
    date: "2025-11-19",
    time: "15:24:15",
    cashier: "JENNIFER L.",
    registerNumber: "ST# 01234 OP# 567890 TE# 23",
    items: [
        { id: "1", name: "ALIBEISS CLEANING WIPES", quantity: 1, price: 8.99 }
    ],
    subtotal: 8.99,
    tax: 0.72,
    total: 9.71,
    paymentMethod: "Cash",
    cardNumber: "$10.00",
    customMessages: {
        top: "See back of receipt for your chance to win $1000 - ID #: 72XXZ523GBA",
        middle: "MANAGER RENE PUENTES - PRODUCT SERIAL # TH66B3C1ZZ",
        bottom: "Thank you for shopping at Walmart! Join Walmart+ for free delivery and more benefits."
    },
    barcode: "4891443570705637291",
    fontStyle: "font1",
    logo: "/assets/favicon/walmart.png"
};

export default function WalmartReceiptPage() {
    return (
        <ReceiptProvider initialData={walmartTemplate}>
            <main className="min-h-screen bg-white">
                <div className="flex w-full h-screen">
                    {/* Left Panel - Form */}
                    <div className="w-1/2 bg-gray-50 border-r border-gray-200">
                        <ReceiptBuilderForm />
                    </div>
                    
                    {/* Right Panel - Preview */}
                    <div className="w-1/2 bg-white">
                        <ReceiptPreview />
                    </div>
                </div>
            </main>
        </ReceiptProvider>
    );
}