"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const UberEatsReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-80 bg-white shadow-lg">
                <div className="p-6 font-sans text-sm">
                    {/* Uber Eats Logo */}
                    <div className="text-center mb-6">
                        <Image 
                            src="/assets/favicon/ubre.png" 
                            alt="Uber Eats" 
                            width={140} 
                            height={45} 
                            className="mx-auto mb-2"
                        />
                    </div>
                    
                    {/* Order Header */}
                    <div className="mb-6">
                        <div className="text-xl font-bold mb-2">Your order</div>
                        <div className="text-gray-600 text-sm">Order #1842-6534</div>
                        <div className="text-gray-600 text-sm">Nov 19, 2025 at 3:45 PM</div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="font-bold text-lg">McDonald's</div>
                        <div className="text-gray-600 text-sm">123 Main Street</div>
                        <div className="text-gray-600 text-sm">Seattle, WA 98101</div>
                        <div className="text-gray-600 text-sm mt-2">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Delivered at 3:52 PM
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="font-semibold mb-2">Delivered to</div>
                        <div className="text-sm">Sarah Johnson</div>
                        <div className="text-sm text-gray-600">456 Pine Avenue, Apt 2B</div>
                        <div className="text-sm text-gray-600">Seattle, WA 98102</div>
                        <div className="text-sm text-gray-600 mt-1">Leave at door</div>
                    </div>

                    {/* Items */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="font-semibold mb-3">Items</div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="font-medium">1x Big Mac</div>
                                    <div className="text-sm text-gray-600">No pickles, Extra sauce</div>
                                </div>
                                <div className="text-right">$6.49</div>
                            </div>
                            
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="font-medium">1x Large Fries</div>
                                </div>
                                <div className="text-right">$3.29</div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="font-medium">1x Coca-Cola</div>
                                    <div className="text-sm text-gray-600">Large</div>
                                </div>
                                <div className="text-right">$2.19</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$11.97</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>$1.99</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service Fee</span>
                                <span>$0.99</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$1.32</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tip</span>
                                <span>$3.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>$19.27</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="font-semibold mb-2">Payment method</div>
                        <div className="text-sm">Visa ••••4567</div>
                    </div>

                    {/* Driver Info */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="font-semibold mb-2">Delivery partner</div>
                        <div className="text-sm">Michael R.</div>
                        <div className="text-sm text-gray-600">⭐ 4.9 • 1,247 deliveries</div>
                    </div>

                    {/* Promo */}
                    <div className="mb-6 text-center">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="text-green-700 font-medium text-sm">
                                🎉 You earned 12 Eats Points!
                            </div>
                            <div className="text-green-600 text-xs mt-1">
                                Use points for future orders
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500 space-y-1">
                        <div>Questions about your order?</div>
                        <div>Get help in the Uber Eats app</div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            Created with Invoify
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UberEatsReceipt;