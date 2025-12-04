"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
    Home, 
    ChefHat, 
    Utensils, 
    Cross, 
    Building2, 
    FileText, 
    Store, 
    ShoppingCart, 
    Receipt, 
    Car, 
    Building, 
    Fuel,
    Phone,
    ChevronDown,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Context
import { useSidebar } from '@/contexts/SidebarContext';

const menuItems = [
    { icon: Home, label: "Home", href: "/", hasSubmenu: false },
    { 
        icon: ChefHat, 
        label: "Fast Food", 
        href: "/?category=fast-food", 
        hasSubmenu: true,
        subItems: [
            { label: "McDonald's Receipt", href: "/receipt-builder?template=3" },
            { label: "Subway Receipt", href: "/fastfood/subway" },
            { label: "Starbucks Receipt", href: "/fastfood/starbucks" },
            { label: "Popeyes Receipt", href: "/fastfood/popeyes" }
        ]
    },
    { 
        icon: Store, 
        label: "Retail", 
        href: "/?category=retail", 
        hasSubmenu: true,
        subItems: [
            { label: "Walmart Receipt", href: "/retail/walmart" },
            { label: "StockX Receipt", href: "/retail/stockx" },
            { label: "Louis Vuitton Receipt", href: "/luxury/louis-vuitton" },
            { label: "Uber Eats Receipt", href: "/delivery/uber-eats" }
        ]
    },
    { 
        icon: FileText, 
        label: "Invoices", 
        href: "/?category=invoices", 
        hasSubmenu: true,
        subItems: [
            { label: "Create Invoice", href: "/create-receipt" },
            { label: "Receipt Builder", href: "/receipt-builder" }
        ]
    },
];

const TemplatesSidebar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const { isSidebarOpen, closeSidebar } = useSidebar();

    const toggleExpanded = (label: string) => {
        setExpandedItems(prev => 
            prev.includes(label) 
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isItemActive = (item: any) => {
        const category = searchParams.get('category');
        
        if (item.label === "Home" && (pathname === "/" || pathname === "/en") && !category) {
            return true;
        }
        
        if (item.label === "Fast Food" && category === "fast-food") {
            return true;
        }
        
        if (item.label === "Retail" && category === "retail") {
            return true;
        }
        
        if (item.label === "Invoices" && category === "invoices") {
            return true;
        }
        
        return false;
    };

    return (
        <Card className="hidden md:block w-80 min-h-screen bg-white dark:bg-gray-800 border-r border-l-0 border-t-0 border-b-0 rounded-none">
                <div className="p-4">
                  

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isExpanded = expandedItems.includes(item.label);
                        const isActive = isItemActive(item);

                        return (
                            <div key={item.label}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => item.hasSubmenu && toggleExpanded(item.label)}
                                    asChild={!item.hasSubmenu}
                                >
                                    {item.hasSubmenu ? (
                                        <div className="flex items-center justify-between w-full">
                                            <Link href={item.href} className="flex items-center gap-3 flex-1">
                                                <Icon className={`h-5 w-5 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                                                <span className={`text-sm font-medium ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`}>{item.label}</span>
                                            </Link>
                                            <div 
                                                className="p-2 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpanded(item.label);
                                                }}
                                            >
                                                <ChevronDown 
                                                    className={`h-5 w-5 transition-transform ${
                                                        isExpanded ? "rotate-180" : ""
                                                    }`} 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={item.href} className="flex items-center gap-3 w-full">
                                            <Icon className={`h-5 w-5 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                                            <span className={`text-sm font-medium ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`}>{item.label}</span>
                                        </Link>
                                    )}
                                </Button>

                                {/* Render submenu items */}
                                {item.hasSubmenu && isExpanded && item.subItems && (
                                    <div className="ml-8 mt-2 space-y-1">
                                        {item.subItems.map((subItem) => (
                                            <Link 
                                                key={subItem.label}
                                                href={subItem.href}
                                                className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                            >
                                                ↳ {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </Card>
    );
};

export default TemplatesSidebar;