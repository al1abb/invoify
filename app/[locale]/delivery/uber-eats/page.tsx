"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Uber Eats template data
const uberEatsTemplate = {
    storeName: "McDonald's",
    storeAddress: "123 Main Street, Seattle, WA 98101",
    phone: "(206) 555-0123",
    date: "2025-11-19", 
    time: "15:45",
    registerNumber: "Order #1842-6534",
    cashier: "Delivery Order",
    items: [
        { id: "1", name: "Big Mac", quantity: 1, price: 6.49 },
        { id: "2", name: "Large Fries", quantity: 1, price: 3.29 },
        { id: "3", name: "Coca-Cola", quantity: 1, price: 2.19 }
    ],
    subtotal: 11.97,
    tax: 1.32,
    total: 19.27,
    paymentMethod: "Visa ••••4567",
    cardNumber: "**** **** **** 4567",
    customMessages: {
        top: "",
        middle: "Delivered to: Sarah Johnson, 456 Pine Avenue, Apt 2B",
        bottom: "Delivery Fee: $1.99 | Service Fee: $0.99 | Tip: $3.00"
    },
    barcode: "1842-6534",
    fontStyle: "font1",
    logo: "/assets/favicon/ubre.png"
};

export default function UberEatsReceiptPage() {
    return (
        <ReceiptProvider initialData={uberEatsTemplate}>
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