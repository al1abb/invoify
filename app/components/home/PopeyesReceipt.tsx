"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const PopeyesReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-80 bg-white shadow-lg">
                <div className="p-6 font-mono text-xs">
                    {/* Popeyes Logo */}
                    <div className="text-center mb-4">
                        <Image 
                            src="/assets/favicon/popeys.jpeg" 
                            alt="Popeyes" 
                            width={140} 
                            height={60} 
                            className="mx-auto mb-2"
                        />
                        <div className="text-orange-600 font-bold text-xs">
                            LOUISIANA KITCHEN
                        </div>
                    </div>
                    
                    {/* Store Info */}
                    <div className="text-center mb-4">
                        <div className="font-bold">Store #2347</div>
                        <div className="text-xs">892 Canal Street</div>
                        <div className="text-xs">New Orleans, LA 70112</div>
                        <div className="text-xs">Phone: (504) 593-2847</div>
                    </div>

                    {/* Transaction Details */}
                    <div className="text-center mb-4 text-xs">
                        <div>Receipt #4729815</div>
                        <div>11/19/2025 2:18:42 PM</div>
                        <div>Cashier: Marcus T.</div>
                        <div>Register: 3</div>
                        <div>ORDER #238</div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Order Type */}
                    <div className="text-center mb-4">
                        <div className="font-bold">DINE IN</div>
                        <div className="text-xs">Table #12</div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">2PC Chicken Combo</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • Spicy
                                    • Mashed Potatoes & Gravy
                                    • Large Coke
                                </div>
                            </div>
                            <div className="text-right">$8.99</div>
                        </div>
                        
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Chicken Sandwich Deluxe</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • Spicy Mayo
                                    • Pickles
                                </div>
                            </div>
                            <div className="text-right">$6.49</div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Red Beans & Rice</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • Large
                                </div>
                            </div>
                            <div className="text-right">$3.79</div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-semibold">Biscuit</div>
                                <div className="text-xs text-gray-600 ml-2">
                                    • 2 Pieces
                                    • Honey Butter
                                </div>
                            </div>
                            <div className="text-right">$2.38</div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Totals */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$21.65</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$2.17</span>
                        </div>
                        <div className="border-t border-solid border-black pt-1">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>$23.82</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <span>Mastercard ****2847</span>
                            <span>$23.82</span>
                        </div>
                        <div className="text-xs mt-1">Chip Read</div>
                        <div className="text-xs">AID: A0000000041010</div>
                        <div className="text-xs">Auth Code: 789321</div>
                        <div className="text-xs">Approval: 472981</div>
                    </div>

                    <div className="border-t border-dashed border-black my-3"></div>

                    {/* Rewards */}
                    <div className="text-center mb-4">
                        <div className="font-bold text-orange-600 mb-1">🔥 POPEYES REWARDS 🔥</div>
                        <div className="text-xs">
                            <div>Points earned this visit: +238</div>
                            <div className="font-semibold">Total Points: 1,847</div>
                            <div className="mt-1 text-orange-600">$5 Reward Available!</div>
                        </div>
                    </div>

                    {/* Promotional Message */}
                    <div className="text-center text-xs mb-4 bg-orange-50 p-2 rounded">
                        <div className="font-bold text-orange-600">🌟 SPECIAL OFFER 🌟</div>
                        <div className="mt-1">
                            Buy 2 Chicken Sandwiches
                        </div>
                        <div>Get 1 FREE Side</div>
                        <div className="text-xs mt-1">Valid until 12/31/2025</div>
                    </div>

                    {/* Footer Message */}
                    <div className="text-center text-xs mb-4">
                        <div className="font-bold">Thank you for choosing Popeyes!</div>
                        <div className="mt-2">
                            Louisiana Fast • Louisiana True
                        </div>
                        <div className="mt-1">
                            Tell us about your visit at
                        </div>
                        <div className="font-bold">tellpopeyes.com</div>
                        <div className="mt-1">
                            Survey code: 2347-238-4729815
                        </div>
                    </div>

                    {/* Store Hours */}
                    <div className="text-center text-xs mb-4">
                        <div className="font-bold">Store Hours</div>
                        <div>Mon-Thu: 10:30 AM - 10:00 PM</div>
                        <div>Fri-Sat: 10:30 AM - 11:00 PM</div>
                        <div>Sunday: 10:30 AM - 9:00 PM</div>
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

export default PopeyesReceipt;