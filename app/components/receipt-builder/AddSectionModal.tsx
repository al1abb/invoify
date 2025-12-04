"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
    Settings, 
    Calendar, 
    MessageSquare, 
    ShoppingCart, 
    CreditCard,
    BarChart3,
    Info,
    Type
} from "lucide-react";

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSection: (sectionType: string) => void;
    existingSections: string[];
}

const sectionOptions = [
    {
        id: "settings",
        title: "Add Header Section", 
        icon: Settings,
        description: "Store information and branding"
    },
    {
        id: "fontstyle",
        title: "Add Font Style Section",
        icon: Type,
        description: "Choose receipt font style"
    },
    {
        id: "datetime",
        title: "Add Date & Time Section",
        icon: Calendar,
        description: "Receipt date and time"
    },
    {
        id: "info",
        title: "Add Two column information Section",
        icon: Info,
        description: "Additional store details"
    },
    {
        id: "itemslist",
        title: "Add Items list Section",
        icon: ShoppingCart,
        description: "Product items and quantities"
    },
    {
        id: "payment",
        title: "Add Payment Section",
        icon: CreditCard,
        description: "Payment method and details"
    },
    {
        id: "custommessage",
        title: "Add Custom message Section",
        icon: MessageSquare,
        description: "Custom text or promotional messages"
    },
    {
        id: "barcode",
        title: "Add Barcode Section",
        icon: BarChart3,
        description: "Receipt barcode or QR code"
    }
];

const AddSectionModal = ({ isOpen, onClose, onAddSection, existingSections }: AddSectionModalProps) => {
    const availableSections = sectionOptions.filter(section => {
        // Allow multiple custom message sections
        if (section.id === "custommessage") return true;
        // For other sections, check if they already exist
        return !existingSections.includes(section.id);
    });

    const handleAddSection = (sectionId: string) => {
        // For custom message, create unique ID
        if (sectionId === "custommessage") {
            const customMessageCount = existingSections.filter(s => s.includes("custommessage")).length;
            const uniqueId = `custommessage${customMessageCount + 1}`;
            onAddSection(uniqueId);
        } else {
            onAddSection(sectionId);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        What section do you want to add?
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-2 mt-4">
                    {availableSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Button
                                key={section.id}
                                variant="outline"
                                className="w-full h-auto p-4 justify-start text-left"
                                onClick={() => handleAddSection(section.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-gray-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">{section.title}</div>
                                        <div className="text-sm text-gray-500">{section.description}</div>
                                    </div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
                
                <div className="flex justify-end mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddSectionModal;