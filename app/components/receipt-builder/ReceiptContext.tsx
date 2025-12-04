"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ReceiptItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
}

interface ReceiptData {
    storeName: string;
    storeAddress: string;
    date: string;
    time: string;
    registerNumber: string;
    cashier: string;
    items: ReceiptItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    cardNumber: string;
    customMessages: {
        top: string;
        middle: string;
        bottom: string;
    };
    phone: string;
    barcode: string;
    fontStyle: string;
    logo?: string;
}

interface ReceiptContextType {
    receiptData: ReceiptData;
    updateReceiptData: (field: string, value: any) => void;
    addItem: (item: ReceiptItem) => void;
    updateItem: (id: string, updates: Partial<ReceiptItem>) => void;
    removeItem: (id: string) => void;
    enabledSections: string[];
    setEnabledSections: (sections: string[]) => void;
    resetToDefault: () => void;
}

const defaultReceiptData: ReceiptData = {
    storeName: "QuickStop Market",
    storeAddress: "",
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format for input
    time: new Date().toTimeString().slice(0, 5), // HH:MM format for input
    registerNumber: "Register #01",
    cashier: "Cashier: T. Morgan",
    items: [
        { id: "1", name: "Chocolate Bar", quantity: 1, price: 2.25 },
        { id: "2", name: "Pack of Chips", quantity: 1, price: 3.00 },
        { id: "3", name: "Canned Soda (12oz)", quantity: 1, price: 1.75 },
        { id: "4", name: "Sandwich", quantity: 1, price: 4.50 },
    ],
    subtotal: 11.50,
    tax: 1.20,
    total: 12.70,
    paymentMethod: "Card",
    cardNumber: "**** **** **** 4522",
    customMessages: {
        top: "",
        middle: "",
        bottom: "Please Come Again!"
    },
    phone: "(303) 555-7612",
    barcode: "1234567890123",
    fontStyle: "font1"
};

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

interface ReceiptProviderProps {
    children: ReactNode;
    initialData?: Partial<ReceiptData>;
}

export const ReceiptProvider = ({ children, initialData }: ReceiptProviderProps) => {
    const [receiptData, setReceiptData] = useState<ReceiptData>(
        initialData ? { ...defaultReceiptData, ...initialData } : defaultReceiptData
    );
    const [enabledSections, setEnabledSections] = useState<string[]>(
        initialData ? ['settings', 'datetime', 'custommessage1', 'itemslist', 'payment'] : ['settings', 'datetime', 'custommessage1', 'itemslist']
    );

    const updateReceiptData = (field: string, value: any) => {
        setReceiptData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addItem = (item: ReceiptItem) => {
        setReceiptData(prev => ({
            ...prev,
            items: [...prev.items, item]
        }));
        calculateTotals();
    };

    const updateItem = (id: string, updates: Partial<ReceiptItem>) => {
        setReceiptData(prev => ({
            ...prev,
            items: prev.items.map(item => 
                item.id === id ? { ...item, ...updates } : item
            )
        }));
        calculateTotals();
    };

    const removeItem = (id: string) => {
        setReceiptData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
        calculateTotals();
    };

    const calculateTotals = () => {
        setTimeout(() => {
            setReceiptData(prev => {
                const subtotal = prev.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const tax = subtotal * 0.08; // 8% tax
                const total = subtotal + tax;
                
                return {
                    ...prev,
                    subtotal: Number(subtotal.toFixed(2)),
                    tax: Number(tax.toFixed(2)),
                    total: Number(total.toFixed(2))
                };
            });
        }, 0);
    };

    const resetToDefault = () => {
        setReceiptData(defaultReceiptData);
        setEnabledSections(['settings', 'datetime', 'custommessage1', 'itemslist']);
    };

    return (
        <ReceiptContext.Provider value={{
            receiptData,
            updateReceiptData,
            addItem,
            updateItem,
            removeItem,
            enabledSections,
            setEnabledSections,
            resetToDefault
        }}>
            {children}
        </ReceiptContext.Provider>
    );
};

export const useReceipt = () => {
    const context = useContext(ReceiptContext);
    if (!context) {
        throw new Error("useReceipt must be used within a ReceiptProvider");
    }
    return context;
};