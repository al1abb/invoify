"use client";

import { useMemo, useState } from "react";

// Next
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Assets
import Logo from "@/public/assets/favicon/recipet.png";

// ShadCn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons
import { Home, ChefHat, Store, FileText } from "lucide-react";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

// Hooks
import { useTranslations } from 'next-intl';

// Context
import { useSidebar } from '@/contexts/SidebarContext';

const BaseNavbar = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    const handleSidebarToggle = () => {
        toggleSidebar();
    };

    return (
        <header className="w-full z-[99]">
            <nav className="w-full h-[50px] sm:h-[60px] md:h-[70px] shadow-[0_4px_16px_-1px_rgba(0,0,0,0.15)] px-4 sm:px-6 md:px-8 bg-white border-b border-gray-100/50">
                <div className="flex items-center justify-between w-full h-full">
                    {/* Logo Section - Left */}
                    <div className="flex items-center justify-start">
                        <Link href={"/"} className="flex items-center">
                            <Image
                                src={Logo}
                                alt="RGen Logo"
                                width={100}
                                height={40}
                                className="w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-auto"
                                priority
                                loading="eager"
                            />
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation - Center */}
                    <div className="flex items-center justify-center flex-1">
                        <div className="hidden lg:flex items-center gap-6">
                        <Link 
                            href="/" 
                            className="font-medium text-sm font-inter relative px-3 py-2 rounded-md whitespace-nowrap flex items-center"
                            style={{
                                ...(pathname === "/" || pathname === "/en" ? {
                                    background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                } : {
                                    color: '#2A2A2A'
                                })
                            }}
                        >
                            Home
                            {(pathname === "/" || pathname === "/en") && (
                                <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: '6.818181991577148px',
                                        height: '2.954545497894287px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                        opacity: 1
                                    }}
                                />
                            )}
                        </Link>
                        <Link 
                            href="/create-receipt" 
                            className="font-medium text-sm font-inter relative px-3 py-2 rounded-md whitespace-nowrap flex items-center"
                            style={{
                                ...(pathname === "/create-receipt" || pathname === "/en/create-receipt" ? {
                                    background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                } : {
                                    color: '#2A2A2A'
                                })
                            }}
                        >
                            Create Invoice
                            {(pathname === "/create-receipt" || pathname === "/en/create-receipt") && (
                                <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: '6.818181991577148px',
                                        height: '2.954545497894287px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                        opacity: 1
                                    }}
                                />
                            )}
                        </Link>
                        <Link 
                            href="/receipt-organizer" 
                            className="font-medium text-sm font-inter relative px-3 py-2 rounded-md whitespace-nowrap flex items-center"
                            style={{
                                ...(pathname === "/receipt-organizer" || pathname === "/en/receipt-organizer" ? {
                                    background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                } : {
                                    color: '#2A2A2A'
                                })
                            }}
                        >
                            Receipt Organizer
                            {(pathname === "/receipt-organizer" || pathname === "/en/receipt-organizer") && (
                                <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: '6.818181991577148px',
                                        height: '2.954545497894287px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                        opacity: 1
                                    }}
                                />
                            )}
                        </Link>
                        <Link 
                            href="/contact" 
                            className="font-medium text-sm font-inter relative px-3 py-2 rounded-md whitespace-nowrap flex items-center"
                            style={{
                                ...(pathname === "/contact" || pathname === "/en/contact" ? {
                                    background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                } : {
                                    color: '#2A2A2A'
                                })
                            }}
                        >
                            Contact Us
                            {(pathname === "/contact" || pathname === "/en/contact") && (
                                <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: '6.818181991577148px',
                                        height: '2.954545497894287px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                        opacity: 1
                                    }}
                                />
                            )}
                        </Link>
                        <Link 
                            href="/feedback" 
                            className="font-medium text-sm font-inter relative px-3 py-2 rounded-md whitespace-nowrap flex items-center"
                            style={{
                                ...(pathname === "/feedback" || pathname === "/en/feedback" ? {
                                    background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                } : {
                                    color: '#2A2A2A'
                                })
                            }}
                        >
                            Feedback
                            {(pathname === "/feedback" || pathname === "/en/feedback") && (
                                <div 
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: '6.818181991577148px',
                                        height: '2.954545497894287px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #8371FF -39.48%, #A077FE 32.07%, #01C7E4 100%)',
                                        opacity: 1
                                    }}
                                />
                            )}
                        </Link>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {/* ? DEV Only */}
                        {/* {devEnv && <DevDebug />}
                        <LanguageSelector /> */}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default BaseNavbar;
