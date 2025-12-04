"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Popeyes template data
const popeyesTemplate = {
    storeName: "Popeyes Store #2347",
    storeAddress: "892 Canal Street, New Orleans, LA 70112",
    phone: "(504) 593-2847",
    date: "2025-11-19",
    time: "14:18:42",
    cashier: "Marcus T.",
    registerNumber: "Receipt #4729815",
    items: [
        { id: "1", name: "2PC Chicken Combo", quantity: 1, price: 8.99 },
        { id: "2", name: "Chicken Sandwich Deluxe", quantity: 1, price: 6.49 },
        { id: "3", name: "Red Beans & Rice", quantity: 1, price: 3.79 },
        { id: "4", name: "Biscuit", quantity: 2, price: 1.19 }
    ],
    subtotal: 21.65,
    tax: 2.17,
    total: 23.82,
    paymentMethod: "Mastercard ****2847",
    cardNumber: "**** **** **** 2847",
    customMessages: {
        top: "",
        middle: "DINE IN - Table #12 - ORDER #238",
        bottom: "Tell us about your visit at tellpopeyes.com | Survey code: 2347-238-4729815"
    },
    barcode: "4729815",
    fontStyle: "font1",
    logo: "/assets/favicon/popeys.jpeg"
};

export default function PopeyesReceiptPage() {
    return (
        <ReceiptProvider initialData={popeyesTemplate}>
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