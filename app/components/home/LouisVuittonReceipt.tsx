"use client";

import { Card } from "@/components/ui/card";

const LouisVuittonReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-96 bg-white shadow-lg">
                <div className="p-6 font-serif text-sm">
                    {/* Louis Vuitton Header */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold tracking-[0.3em] text-black mb-2">
                            LOUIS VUITTON
                        </div>
                        <div className="text-sm text-gray-600 tracking-wide">
                            MAISON FONDÉE EN 1854
                        </div>
                    </div>

                    {/* Store Information */}
                    <div className="text-center mb-6 space-y-1">
                        <div className="font-semibold text-gray-800">Louis Vuitton Beverly Hills</div>
                        <div className="text-sm text-gray-600">295 N Rodeo Dr</div>
                        <div className="text-sm text-gray-600">Beverly Hills, CA 90210</div>
                        <div className="text-sm text-gray-600">Tel: (310) 859-0457</div>
                    </div>

                    {/* Transaction Details */}
                    <div className="border-t border-b border-gray-200 py-4 mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Receipt No:</span>
                            <span className="font-mono">LV240119001</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Date:</span>
                            <span>November 19, 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Time:</span>
                            <span>14:30:00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Sales Associate:</span>
                            <span>Marie Dubois</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Customer:</span>
                            <span>Ms. Johnson</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <div className="font-semibold text-gray-900 mb-1">
                                Neverfull MM Monogram Canvas
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                                Style: M41175 | Color: Monogram
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Qty: 1</span>
                                <span className="font-semibold">$1,960.00</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                            <div className="font-semibold text-gray-900 mb-1">
                                Twist PM Epi Leather
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                                Style: M50282 | Color: Noir (Black)
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Qty: 1</span>
                                <span className="font-semibold">$4,400.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>$6,360.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax:</span>
                            <span>$636.00</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                            <span>Total:</span>
                            <span>$6,996.00</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment:</span>
                            <span>American Express ****1006</span>
                        </div>
                    </div>

                    {/* Authenticity & Care Instructions */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center space-y-2">
                            <div className="text-xs font-semibold text-gray-800">
                                CERTIFICATE OF AUTHENTICITY
                            </div>
                            <div className="text-xs text-gray-600 leading-relaxed">
                                This Louis Vuitton product is guaranteed authentic.
                                Each piece is individually crafted with the finest materials.
                            </div>
                        </div>
                    </div>

                    {/* Care Instructions */}
                    <div className="mt-4 text-center">
                        <div className="text-xs text-gray-600 leading-relaxed">
                            Care instructions and warranty information
                            available at louisvuitton.com
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <div className="mt-6 text-center">
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                            Merci • Thank You • ありがとうございます
                        </div>
                        <div className="text-xs text-gray-600">
                            We appreciate your visit to Louis Vuitton
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                        <div className="text-xs text-gray-400">
                            louisvuitton.com
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LouisVuittonReceipt;