"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const StarbucksReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-80 bg-white shadow-lg">
                <div className="p-6 font-mono text-xs">
                    {/* Starbucks Logo */}
                    <div className="text-center mb-4">
                        <Image 
                            src="/assets/favicon/start%20bug.png" 
                            alt="Starbucks" 
                            width={120} 
                            height={40} 
                            className="mx-auto mb-2"
                        />
                        <div className="text-green-600 font-semibold text-xs">
                            Coffee Company
                        </div>
                    </div>
                    
                    {/* Store Info */}
                    <div className="text-center mb-4">
                        <div className="font-bold">Store # 47089</div>
                        <div className="text-xs">123 Main Street</div>
                        <div className="text-xs">Seattle, WA 98101</div>
                        <div className="text-xs">Phone: (206) 555-0123</div>
                    </div>

                    {/* Transaction Details */}
                    <div className="text-center mb-4 text-xs">
                        <div>CHK 742896</div>
                        <div>11/19/2025 12:34:56 PM</div>
                        <div>Cashier: Sarah M</div>
                        <div>Register: 1</div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Order Details */}
                    <div className="mb-4">
                        <div className="font-bold mb-2">ORDER #47089-240</div>
                        <div className="text-xs mb-1">For Here</div>
                        <div className="text-xs">Mobile Order & Pay</div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Grande Pike Place Roast</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • No Room
                                    • Hot
                                </div>
                            </div>
                            <div className="text-right">$2.45</div>
                        </div>
                        
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Blueberry Muffin</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • Warmed
                                </div>
                            </div>
                            <div className="text-right">$3.25</div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Venti Iced Caramel Macchiato</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • 2% Milk
                                    • Extra Hot
                                    • 2 Pumps Vanilla
                                </div>
                            </div>
                            <div className="text-right">$5.75</div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Totals */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$11.45</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$1.03</span>
                        </div>
                        <div className="border-t border-solid border-black pt-1">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>$12.48</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <span>Visa Credit **** 4567</span>
                            <span>$12.48</span>
                        </div>
                        <div className="text-xs mt-1">Chip Read</div>
                        <div className="text-xs">AID: A0000000031010</div>
                        <div className="text-xs">Auth Code: 123456</div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Stars & Rewards */}
                    <div className="text-center mb-4">
                        <div className="font-bold text-green-600 mb-1">⭐ STARBUCKS REWARDS ⭐</div>
                        <div className="text-xs">
                            <div>Balance before this purchase</div>
                            <div className="font-semibold">★ ★ ★ ★ ☆ 125 Stars</div>
                            <div className="mt-1">Stars earned this purchase: +25</div>
                            <div className="font-semibold">Current balance: 150 Stars</div>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="text-center text-xs mb-4">
                        <div className="font-bold">Thank you for visiting!</div>
                        <div className="mt-2">
                            Rate your experience at
                        </div>
                        <div className="font-bold">mystarbucksvisit.com</div>
                        <div className="mt-1">
                            Survey code: 47089-240-742896
                        </div>
                    </div>

                    {/* Store Hours */}
                    <div className="text-center text-xs mb-4">
                        <div className="font-bold">Store Hours</div>
                        <div>Mon-Fri: 5:30 AM - 9:00 PM</div>
                        <div>Sat-Sun: 6:00 AM - 8:00 PM</div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Watermark */}
                    <div className="text-center text-xs text-gray-400">
                        Created with Receipt
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StarbucksReceipt;