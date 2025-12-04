"use client";

import { useSearchParams } from "next/navigation";
// Components
import { ReceiptProvider } from "@/app/components/receipt-builder/ReceiptContext";
import ReceiptBuilderForm from "@/app/components/receipt-builder/ReceiptBuilderForm";
import ReceiptPreview from "@/app/components/receipt-builder/ReceiptPreview";

// Template data
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

export default function ReceiptBuilderPage() {
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');
    
    // Get initial template data based on template ID
    const getInitialData = () => {
        switch (templateId) {
            case '4':
                return subwayTemplate;
            case '5':
                return starbucksTemplate;
            case '6':
                return uberEatsTemplate;
            case '7':
                return popeyesTemplate;
            case '8':
                return walmartTemplate;
            case '9':
                return stockXTemplate;
            case '11':
                return louisVuittonTemplate;
            default:
                return undefined;
        }
    };
    
    return (
        <ReceiptProvider initialData={getInitialData()}>
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