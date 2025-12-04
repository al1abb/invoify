"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Assets

const TemplatesNavbar = () => {
    return (
        <header className="w-full bg-white dark:bg-gray-800 border-b">
            <nav className="container mx-auto px-4 max-w-6xl">
                <Card className="flex flex-wrap justify-between items-center px-4 py-2 gap-4 border-0 shadow-none">
                    <Link href="/" className="flex items-center">
                        <div className="flex items-center gap-2">
                            <Image 
                                src="/assets/favicon/recipet.png"
                                alt="Receipt Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                                priority
                                unoptimized
                            />
                            <span className="text-lg font-bold text-blue-600">RGen</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                Home
                            </Button>
                        </Link>
                        
                        <div className="relative group">
                            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                Solutions
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50">
                                <div className="py-2">
                                    <Link href="/create-receipt" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600">
                                        Create Receipt
                                    </Link>
                                    <Link href="/templates" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600">
                                        Receipt Templates
                                    </Link>
                                    <Link href="/invoice-generator" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600">
                                        Invoice Generator
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/contact">
                            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                Contact Us
                            </Button>
                        </Link>

                        <Link href="/feedback">
                            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                Feedback
                            </Button>
                        </Link>

                        <Link href="/pricing">
                            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                Pricing Plans
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="border-gradient-to-r border-purple-500 text-purple-600 hover:bg-purple-50">
                            LOGIN
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white border-0">
                            SIGN UP
                        </Button>
                    </div>
                </Card>
            </nav>
        </header>
    );
};

export default TemplatesNavbar;