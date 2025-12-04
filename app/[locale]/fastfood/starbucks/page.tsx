"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Starbucks template data
const starbucksTemplate = {
    storeName: "Starbucks Store # 47089",
    storeAddress: "123 Main Street, Seattle, WA 98101",
    phone: "(206) 555-0123",
    date: "2025-11-19",
    time: "12:34:56",
    cashier: "Sarah M",
    registerNumber: "Register: 1",
    items: [
        { id: "1", name: "Grande Pike Place Roast", quantity: 1, price: 2.45 },
        { id: "2", name: "Blueberry Muffin", quantity: 1, price: 3.25 },
        { id: "3", name: "Venti Iced Caramel Macchiato", quantity: 1, price: 5.75 }
    ],
    subtotal: 11.45,
    tax: 1.03,
    total: 12.48,
    paymentMethod: "Visa Credit **** 4567",
    cardNumber: "**** **** **** 4567",
    customMessages: {
        top: "",
        middle: "",
        bottom: "Thank you for visiting! Rate your experience at mystarbucksvisit.com"
    },
    barcode: "47089-240-742896",
    fontStyle: "font1",
    logo: "/assets/favicon/start%20bug.png"
};

export default function StarbucksReceiptPage() {
    return (
        <ReceiptProvider initialData={starbucksTemplate}>
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