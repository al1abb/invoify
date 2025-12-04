"use client";

// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// StockX template data
const stockXTemplate = {
    storeName: "StockX",
    storeAddress: "1046 Woodward Ave, Detroit, MI 48226",
    phone: "support@stockx.com",
    date: "2025-11-19",
    time: "14:30:00",
    cashier: "StockX Authentication",
    registerNumber: "Order #76425439-73784585",
    items: [
        { id: "1", name: "Jordan 1 Retro Low OG SP", quantity: 1, price: 219.00 },
        { id: "2", name: "Processing Fee", quantity: 1, price: 29.95 },
        { id: "3", name: "Shipping", quantity: 1, price: 17.45 }
    ],
    subtotal: 219.00,
    tax: 15.25,
    total: 266.40,
    paymentMethod: "Visa Credit",
    cardNumber: "**** **** **** 4567",
    customMessages: {
        top: "Peter Vincent - 1205 Ocean Breeze Ave, Santa Monica, CA 91092",
        middle: "Size: 11 | Style: DM7866-202 | Colorway: Dark Mocha/Black/Velvet Brown",
        bottom: "✅ VERIFIED AUTHENTIC - Please inspect item. All claims null and void if StockX verified authentic tag is removed."
    },
    barcode: "76425439-73784585",
    fontStyle: "font1",
    logo: "/assets/favicon/stock.png"
};

export default function StockXReceiptPage() {
    return (
        <ReceiptProvider initialData={stockXTemplate}>
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