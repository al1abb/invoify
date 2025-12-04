"use client";

import { useMemo, useState } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Components
import {
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    PaymentInformation,
    InvoiceSummary,
} from "@/app/components";

// Icons
import { 
    User, 
    UserCheck, 
    FileText, 
    ShoppingCart, 
    CreditCard,
    Calculator,
    ChevronDown,
    GripVertical,
    X
} from "lucide-react";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

interface FormSection {
    id: string;
    title: string;
    icon: any;
    enabled: boolean;
    expanded: boolean;
    component: React.ReactNode;
}

const InvoiceForm = () => {
    const { _t } = useTranslationContext();

    const { control } = useFormContext();

    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return _t("form.newInvBadge");
        }
    }, [invoiceNumber]);

    const [sections, setSections] = useState<FormSection[]>([
        { 
            id: "billfrom", 
            title: "Bill From", 
            icon: User, 
            enabled: true, 
            expanded: true,
            component: <BillFromSection />
        },
        { 
            id: "billto", 
            title: "Bill To", 
            icon: UserCheck, 
            enabled: true, 
            expanded: false,
            component: <BillToSection />
        },
        { 
            id: "details", 
            title: "Invoice Details", 
            icon: FileText, 
            enabled: true, 
            expanded: false,
            component: <InvoiceDetails />
        },
        { 
            id: "items", 
            title: "Line Items", 
            icon: ShoppingCart, 
            enabled: true, 
            expanded: false,
            component: <Items />
        },
        { 
            id: "payment", 
            title: "Payment Info", 
            icon: CreditCard, 
            enabled: true, 
            expanded: false,
            component: <PaymentInformation />
        },
        { 
            id: "summary", 
            title: "Summary", 
            icon: Calculator, 
            enabled: true, 
            expanded: false,
            component: <InvoiceSummary />
        },
    ]);

    const toggleSection = (sectionId: string) => {
        setSections(sections.map(section => 
            section.id === sectionId 
                ? { ...section, expanded: !section.expanded }
                : section
        ));
    };

    return (
        <div className="w-full xl:w-[50%]">
            <Card className="px-4 md:px-6">
                <CardHeader>
                    <div className="flex gap-3">
                        <CardTitle className="flex items-center gap-3">
                            <span className="uppercase bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {_t("form.title")}
                            </span>
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit">
                            <p style={{ fontSize: "14px" }}>
                                {invoiceNumberLabel}
                            </p>
                        </Badge>
                    </div>
                    <CardDescription>{_t("form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
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
                                            <div className="pt-3">
                                                {section.component}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
