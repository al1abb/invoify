"use client";

import { Card } from "@/components/ui/card";

const WalmartReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-80 bg-white shadow-lg">
                <div className="p-6 font-mono text-xs leading-tight">
                    {/* Contest Header */}
                    <div className="text-center mb-4 text-xs">
                        <div>See back of receipt for your chance</div>
                        <div>to win $1000</div>
                        <div className="mt-2">ID #: 72XXZ523GBA</div>
                    </div>
                    
                    {/* Walmart Logo */}
                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            Walmart ✧
                        </div>
                        <div className="text-sm font-semibold">
                            Save money. Live better.
                        </div>
                    </div>
                    
                    {/* Store Info */}
                    <div className="text-center mb-4 text-xs">
                        <div>(915) 968 - 2258</div>
                        <div>MANAGER RENE PUENTES</div>
                        <div>3451 TRUXEL RD</div>
                        <div>SACRAMENTO CA 23456</div>
                        <div className="mt-2">
                            ST# 01234 OP# 567890 TE# 23 TR#
                        </div>
                        <div>03111</div>
                        <div>PRODUCT SERIAL # TH66B3C1ZZ</div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <span>1 ALIBEISS CLEANING WIPES</span>
                            <span>$8.99</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$8.99</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$0.72</span>
                        </div>
                        <div className="border-t border-black pt-1 mt-2">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>$9.71</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span>Cash</span>
                            <span>$10</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Change</span>
                            <span>$0.29</span>
                        </div>
                    </div>

                    {/* Items Count */}
                    <div className="mb-4 text-left">
                        <div># ITEMS SOLD 1</div>
                    </div>

                    {/* Transaction Code */}
                    <div className="text-center text-xs mb-4">
                        <div>TC# 4891 4435 7070 5637 2915</div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center text-xs mb-4">
                        <div className="mb-2">
                            <div>11/19/2025 3:24:15 PM</div>
                            <div>Cashier: JENNIFER L.</div>
                        </div>
                        
                        <div className="mb-2">
                            <div>Thank you for shopping at Walmart!</div>
                            <div className="mt-1">
                                Save time and money with
                            </div>
                            <div>Walmart+</div>
                        </div>
                        
                        <div className="mb-2">
                            <div>Return Policy: 90 days with receipt</div>
                            <div>For details, visit walmart.com/returns</div>
                        </div>
                    </div>

                    {/* Survey Info */}
                    <div className="text-center text-xs mb-4 bg-blue-50 p-2 rounded">
                        <div className="font-bold">📱 Take Our Survey</div>
                        <div className="mt-1">
                            Tell us about your experience
                        </div>
                        <div>Go to survey.walmart.com</div>
                        <div className="font-bold mt-1">Survey Code: 01234-567890</div>
                    </div>

                    {/* Walmart+ Promotion */}
                    <div className="text-center text-xs mb-4 bg-yellow-50 p-2 rounded border border-yellow-200">
                        <div className="font-bold text-blue-600">🌟 JOIN WALMART+ 🌟</div>
                        <div className="mt-1">
                            Free delivery • Gas discounts
                        </div>
                        <div>Mobile Scan & Go • More!</div>
                        <div className="text-xs mt-1">Start your free 30-day trial</div>
                    </div>

                    {/* Environmental Message */}
                    <div className="text-center text-xs mb-4">
                        <div className="text-green-600">🌱 Go Green!</div>
                        <div>Get digital receipts in the</div>
                        <div>Walmart app</div>
                    </div>

                    {/* Store Hours */}
                    <div className="text-center text-xs mb-4">
                        <div className="font-bold">Store Hours</div>
                        <div>Mon-Sun: 6:00 AM - 11:00 PM</div>
                        <div>Pharmacy: 9:00 AM - 8:00 PM</div>
                    </div>

                    <div className="border-t border-gray-300 my-3"></div>

                    {/* Watermark */}
                    <div className="text-center text-xs text-gray-400">
                        Created with Receipt
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WalmartReceipt;