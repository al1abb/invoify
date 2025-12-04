"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const StockXReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-96 bg-white shadow-lg">
                <div className="p-6 font-sans text-sm">
                    {/* Header with StockX Logo and NOW YOU KNOW */}
                    <div className="bg-black text-white p-4 mb-6 -m-6 mb-6 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <Image 
                                    src="/assets/favicon/stock.png" 
                                    alt="StockX" 
                                    width={80} 
                                    height={30} 
                                    className="mr-4"
                                />
                                <div className="text-white font-bold text-lg">
                                    NOW<br />YOU<br />KNOW
                                </div>
                            </div>
                            <div className="text-right text-xs">
                                2025-11-19
                            </div>
                        </div>
                        
                        {/* Diagonal design element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 transform rotate-45 translate-x-16 -translate-y-16"></div>
                    </div>
                    
                    {/* Customer and Order Info */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="font-semibold text-gray-800 mb-2">Peter Vincent</div>
                            <div className="text-sm text-gray-600">
                                <div>1205 Ocean Breeze Ave</div>
                                <div>Santa Monica, CA 91092</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-800 mb-1">Order Number:</div>
                            <div className="text-sm text-gray-600">76425439-73784585</div>
                        </div>
                    </div>

                    {/* Product Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                            Jordan 1 Retro Low OG SP
                        </h2>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">U.S Men's Size</span>
                            <span className="text-gray-900">11</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Colorway</span>
                            <span className="text-gray-900">Dark Mocha/Black/Velvet Brown</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Style</span>
                            <span className="text-gray-900">DM7866-202</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Condition</span>
                            <span className="text-gray-900">New, 100% authentic</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4"></div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Purchase Price</span>
                            <span className="text-gray-900">$219.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Import Duties (Incl. above)</span>
                            <span className="text-gray-900">FREE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Tax (Incl. above)</span>
                            <span className="text-gray-900">$15.25</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Import Duties (Incl. in price)</span>
                            <span className="text-gray-900">FREE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Processing Fee</span>
                            <span className="text-gray-900">$29.95</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Shipping</span>
                            <span className="text-gray-900">$17.45</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3 mt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">$266.40</span>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-6 mb-4">
                        <div className="text-green-800 text-xs font-medium">
                            ✅ VERIFIED AUTHENTIC
                        </div>
                        <div className="text-green-700 text-xs mt-1">
                            Please inspect item. All claims null and void if StockX verified authentic tag is removed.
                        </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 mb-4">
                        <div className="text-xs text-gray-600 space-y-1">
                            <div className="font-semibold text-gray-800 mb-2">Purchase Details:</div>
                            <div>• All items are verified authentic by StockX</div>
                            <div>• 3-day inspection period upon delivery</div>
                            <div>• Items must be in original condition</div>
                            <div>• No returns after authenticity tag removal</div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center text-xs text-gray-500 space-y-2 mt-6">
                        <div className="font-semibold">StockX LLC</div>
                        <div>1046 Woodward Ave, Detroit, MI 48226</div>
                        <div>support@stockx.com | stockx.com</div>
                        
                        <div className="pt-3 border-t border-gray-200 mt-4">
                            <div className="text-gray-400">
                                Created with Invoify
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StockXReceipt;