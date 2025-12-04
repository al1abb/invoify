import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/favicon/recipet.png";
import { MessageCircle, Linkedin, Instagram, Twitter } from "lucide-react";

const BaseFooter = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 py-12 mt-8 border-t border-gray-800 dark:border-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Logo Section - Left */}
                    <div className="md:col-span-3 flex flex-col gap-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={Logo}
                                alt="RGen Logo"
                                width={100}
                                height={40}
                                className="w-[80px] sm:w-[100px] h-auto"
                                priority
                                loading="eager"
                            />
                        </Link>
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://wa.me/917973361737"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-green-500 transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div className="md:col-span-3">
                        <h3 className="text-base font-medium text-white mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/create-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Create Invoice
                                </Link>
                            </li>
                            <li>
                                <Link href="/receipt-organizer" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Receipt Organizer
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Receipt Generator
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* All Pages Column */}
                    <div className="md:col-span-3">
                        <h3 className="text-base font-medium text-white mb-4">All Pages</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/subway-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Subway Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/starbucks-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Starbucks Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/popeyes-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Popeyes Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/walmart-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Walmart Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/stockx-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    StockX Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/louis-vuitton-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Louis Vuitton Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/uber-eats-receipt" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Uber Eats Receipt
                                </Link>
                            </li>
                            <li>
                                <Link href="/receipt-builder?template=3" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    McDonald's Receipt
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="md:col-span-3">
                        <h3 className="text-base font-medium text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/feedback" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 dark:border-gray-900 pt-6">
                    <p className="text-sm text-gray-400 text-center">
                        &copy; 2024 RGen. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default BaseFooter;
