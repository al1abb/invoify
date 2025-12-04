"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Subway template data
const subwayTemplate = {
    storeName: "Subway #21365-0",
    storeAddress: "3680 Avenue of the Cities, Moline, IL 61265, United States",
    phone: "3176666728",
    date: "2025-12-15",
    time: "18:34:18",
    cashier: "Cashier: Mariana",
    registerNumber: "Term ID-Trans# 9/A - 689172",
    items: [
        { id: "1", name: "CHEESY PANEER TIKKA", quantity: 1, price: 5.00, size: "1'" }
    ],
    subtotal: 5.00,
    tax: 0.50,
    total: 5.50,
    paymentMethod: "VISA",
    cardNumber: "**** **** **** 1234",
    customMessages: {
        top: "",
        middle: "Host Order ID: EYHMVUDYTF73",
        bottom: "Take one min survey @ tellsubway.in and get a free cookie on next purchase."
    },
    barcode: "EYHMVUDYTF73",
    fontStyle: "font1",
    logo: "/assets/favicon/subway.png"
};

export default function SubwayReceiptPage() {
    return (
        <ReceiptProvider initialData={subwayTemplate}>
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