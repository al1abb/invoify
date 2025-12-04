"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReceipt } from "./ReceiptContext";
import { 
    Settings, 
    Calendar, 
    MessageSquare, 
    ShoppingCart, 
    CreditCard,
    Plus,
    X,
    ChevronDown,
    GripVertical,
    Trash2,
    Type
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AddSectionModal from "./AddSectionModal";

interface FormSection {
    id: string;
    title: string;
    icon: any;
    enabled: boolean;
    expanded: boolean;
}

const ReceiptBuilderForm = () => {
    const { receiptData, updateReceiptData, addItem, updateItem, removeItem, enabledSections, setEnabledSections } = useReceipt();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [sections, setSections] = useState<FormSection[]>([
        { id: "settings", title: "Store Info", icon: Settings, enabled: true, expanded: true },
        { id: "fontstyle", title: "Font Style", icon: Type, enabled: true, expanded: false },
        { id: "datetime", title: "Date & Time", icon: Calendar, enabled: true, expanded: false },
        { id: "custommessage1", title: "Custom message", icon: MessageSquare, enabled: true, expanded: false },
        { id: "itemslist", title: "Items list", icon: ShoppingCart, enabled: true, expanded: false },
        { id: "payment", title: "Payment", icon: CreditCard, enabled: true, expanded: false },
        { id: "custommessage2", title: "Custom message", icon: MessageSquare, enabled: true, expanded: false },
    ]);

    const removeSection = (sectionId: string) => {
        const newSections = sections.filter(section => section.id !== sectionId);
        setSections(newSections);
        // Update enabled sections in context
        setEnabledSections(newSections.map(s => s.id));
    };

    const handleAddSection = (sectionType: string) => {
        // Check if section already exists (except custom messages)
        if (!sectionType.includes("custommessage") && sections.some(s => s.id === sectionType)) {
            return; // Section already exists
        }

        const sectionMap: Record<string, any> = {
            settings: { title: "Store Info", icon: Settings },
            fontstyle: { title: "Font Style", icon: Type },
            datetime: { title: "Date & Time", icon: Calendar },
            info: { title: "Two Column Info", icon: Settings },
            itemslist: { title: "Items list", icon: ShoppingCart },
            payment: { title: "Payment", icon: CreditCard },
            barcode: { title: "Barcode", icon: Settings }
        };

        let newSection;
        if (sectionType.includes("custommessage")) {
            // Handle custom message sections with unique IDs
            newSection = {
                id: sectionType,
                title: "Custom message",
                icon: MessageSquare,
                enabled: true,
                expanded: true
            };
        } else if (sectionMap[sectionType]) {
            newSection = {
                id: sectionType,
                ...sectionMap[sectionType],
                enabled: true,
                expanded: true
            };
        } else {
            return; // Unknown section type
        }

        const newSections = [...sections, newSection];
        setSections(newSections);
        setEnabledSections(newSections.map(s => s.id));
    };

    const toggleSection = (sectionId: string) => {
        setSections(sections.map(section => 
            section.id === sectionId 
                ? { ...section, expanded: !section.expanded }
                : section
        ));
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-100">
            <div className="p-6">
                <div className="space-y-4">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div key={section.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                                {/* Section Header */}
                                <div 
                                    className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-6 w-6 text-gray-600" />
                                        <span className="text-base font-medium text-gray-900">{section.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                            <GripVertical className="h-5 w-5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSection(section.id);
                                            }}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                        <ChevronDown 
                                            className={`h-5 w-5 text-gray-400 transition-transform ml-1 ${
                                                section.expanded ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </div>
                                </div>
                                
                                {/* Section Content */}
                                {section.expanded && (
                                    <div className="px-4 pb-4 border-t border-gray-100">
                                        {section.id === "settings" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="storeName">Store Name</Label>
                                                    <Input 
                                                        id="storeName" 
                                                        value={receiptData.storeName}
                                                        onChange={(e) => updateReceiptData('storeName', e.target.value)}
                                                        placeholder="Store name"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="registerNumber">Register Number</Label>
                                                    <Input 
                                                        id="registerNumber" 
                                                        value={receiptData.registerNumber}
                                                        onChange={(e) => updateReceiptData('registerNumber', e.target.value)}
                                                        placeholder="Register #01"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cashier">Cashier</Label>
                                                    <Input 
                                                        id="cashier" 
                                                        value={receiptData.cashier}
                                                        onChange={(e) => updateReceiptData('cashier', e.target.value)}
                                                        placeholder="Cashier: Name"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input 
                                                        id="phone" 
                                                        value={receiptData.phone}
                                                        onChange={(e) => updateReceiptData('phone', e.target.value)}
                                                        placeholder="(xxx) xxx-xxxx"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {section.id === "fontstyle" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="fontStyle">Font Style</Label>
                                                    <Select
                                                        value={receiptData.fontStyle || "font1"}
                                                        onValueChange={(value) => updateReceiptData('fontStyle', value)}
                                                    >
                                                        <SelectTrigger id="fontStyle">
                                                            <SelectValue placeholder="Select font style" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="font1">Font Style 1</SelectItem>
                                                            <SelectItem value="font2">Font Style 2</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}

                                        {section.id === "datetime" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="receiptDate">Date</Label>
                                                    <Input 
                                                        id="receiptDate" 
                                                        type="date"
                                                        value={receiptData.date}
                                                        onChange={(e) => updateReceiptData('date', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="receiptTime">Time</Label>
                                                    <Input 
                                                        id="receiptTime" 
                                                        type="time"
                                                        value={receiptData.time}
                                                        onChange={(e) => updateReceiptData('time', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {section.id === "itemslist" && (
                                            <div className="space-y-3 pt-3">
                                                <Label>Items</Label>
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500">
                                                        <span>Item</span>
                                                        <span>Qty</span>
                                                        <span>Price</span>
                                                        <span></span>
                                                    </div>
                                                    {receiptData.items.map((item) => (
                                                        <div key={item.id} className="grid grid-cols-4 gap-2 items-center">
                                                            <Input 
                                                                placeholder="Item name" 
                                                                value={item.name}
                                                                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                                            />
                                                            <Input 
                                                                type="number" 
                                                                placeholder="1" 
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const qty = parseInt(e.target.value) || 0;
                                                                    updateItem(item.id, { quantity: qty });
                                                                }}
                                                            />
                                                            <Input 
                                                                type="number" 
                                                                step="0.01"
                                                                placeholder="0.00" 
                                                                value={item.price}
                                                                onChange={(e) => {
                                                                    const price = parseFloat(e.target.value) || 0;
                                                                    updateItem(item.id, { price: price });
                                                                }}
                                                            />
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="w-full"
                                                        onClick={() => addItem({
                                                            id: Date.now().toString(),
                                                            name: "New Item",
                                                            quantity: 1,
                                                            price: 0
                                                        })}
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        Add Item
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {section.id === "payment" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                                    <Input 
                                                        id="paymentMethod" 
                                                        value={receiptData.paymentMethod}
                                                        onChange={(e) => updateReceiptData('paymentMethod', e.target.value)}
                                                        placeholder="Card"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cardNumber">Card Number</Label>
                                                    <Input 
                                                        id="cardNumber" 
                                                        value={receiptData.cardNumber}
                                                        onChange={(e) => updateReceiptData('cardNumber', e.target.value)}
                                                        placeholder="**** **** **** 4522"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {section.id.includes("custommessage") && (
                                            <div className="pt-3">
                                                <Label htmlFor={`message-${section.id}`}>Custom Message</Label>
                                                <Textarea 
                                                    id={`message-${section.id}`}
                                                    placeholder="Enter custom message..."
                                                    className="h-16"
                                                    value={receiptData.customMessages.bottom}
                                                    onChange={(e) => updateReceiptData('customMessages', {
                                                        ...receiptData.customMessages,
                                                        bottom: e.target.value
                                                    })}
                                                />
                                            </div>
                                        )}

                                        {section.id === "info" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="storeAddress">Store Address</Label>
                                                    <Input 
                                                        id="storeAddress" 
                                                        value={receiptData.storeAddress}
                                                        onChange={(e) => updateReceiptData('storeAddress', e.target.value)}
                                                        placeholder="123 Main St, City, State"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {section.id === "barcode" && (
                                            <div className="space-y-3 pt-3">
                                                <div>
                                                    <Label htmlFor="barcode">Barcode Number</Label>
                                                    <Input 
                                                        id="barcode" 
                                                        value={receiptData.barcode}
                                                        onChange={(e) => updateReceiptData('barcode', e.target.value)}
                                                        placeholder="1234567890123"
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <Label>Preview:</Label>
                                                    <div className="mt-2 p-2 bg-gray-100 rounded">
                                                        <div className="flex justify-center items-end space-x-px">
                                                            {receiptData.barcode.split('').map((digit, i) => {
                                                                const patterns = ['1px', '2px', '1px', '3px', '2px'];
                                                                const heights = ['15px', '20px', '18px', '22px', '16px'];
                                                                return (
                                                                    <div 
                                                                        key={i}
                                                                        className="bg-black"
                                                                        style={{
                                                                            width: patterns[parseInt(digit) % 5] || '1px',
                                                                            height: heights[parseInt(digit) % 5] || '15px'
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="text-xs font-mono mt-1">{receiptData.barcode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    <div className="flex justify-center pt-2">
                        <Button 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Section
                        </Button>
                    </div>
                </div>
            </div>
            
            <AddSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddSection={handleAddSection}
                existingSections={sections.map(s => s.id)}
            />
        </div>
    );
};

export default ReceiptBuilderForm;