"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Louis Vuitton template data
const louisVuittonTemplate = {
    storeName: "Louis Vuitton Beverly Hills",
    storeAddress: "295 N Rodeo Dr, Beverly Hills, CA 90210",
    phone: "(310) 859-0457",
    date: "2025-11-19",
    time: "14:30:00",
    cashier: "Marie Dubois",
    registerNumber: "Receipt No: LV240119001",
    items: [
        { id: "1", name: "Neverfull MM Monogram Canvas", quantity: 1, price: 1960.00 },
        { id: "2", name: "Twist PM Epi Leather", quantity: 1, price: 4400.00 }
    ],
    subtotal: 6360.00,
    tax: 636.00,
    total: 6996.00,
    paymentMethod: "American Express ****1006",
    cardNumber: "**** **** **** 1006",
    customMessages: {
        top: "MAISON FONDÉE EN 1854 - Customer: Ms. Johnson",
        middle: "CERTIFICATE OF AUTHENTICITY - This Louis Vuitton product is guaranteed authentic.",
        bottom: "Merci • Thank You • ありがとうございます - We appreciate your visit to Louis Vuitton"
    },
    barcode: "LV240119001",
    fontStyle: "font1"
};

export default function LouisVuittonReceiptPage() {
    return (
        <ReceiptProvider initialData={louisVuittonTemplate}>
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