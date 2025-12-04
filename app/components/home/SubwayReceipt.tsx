"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const SubwayReceipt = () => {
    return (
        <div className="flex justify-center p-8">
            <Card className="w-80 bg-white shadow-lg">
                <div className="p-6 font-mono text-xs">
                    {/* Subway Logo */}
                    <div className="text-center mb-4">
                        <Image 
                            src="/assets/favicon/subway.png" 
                            alt="Subway" 
                            width={120} 
                            height={40} 
                            className="mx-auto"
                        />
                    </div>
                    
                    {/* Store Info */}
                    <div className="text-center mb-4">
                        <div className="font-bold">Subway #76681-9</div>
                        <div className="text-xs">3680 Avenue of the Cities, Moline,</div>
                        <div className="text-xs">IL 61265, United States</div>
                        <div className="text-xs mt-2">Phone 2572225588</div>
                        <div className="text-xs">Served by: Mariana 12/15/2025 18:18:50</div>
                        <div className="text-xs">Term ID-Trans# 5/A - 915708</div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                            <span>Qty Size Item</span>
                            <span>Price</span>
                        </div>
                        <div className="border-t border-dashed border-black my-1"></div>
                        <div className="flex justify-between">
                            <span>1   6"   CHEESY PANEER TIKKA</span>
                            <span>5.00</span>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-dashed border-black pt-2 mb-4">
                        <div className="flex justify-between">
                            <span>Sub Total</span>
                            <span>5.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>General Sales Tax GST (10%)</span>
                            <span>0.50</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total (Eat In)</span>
                            <span>5.50</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Visa</span>
                            <span>5.50</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Change</span>
                            <span>0.00</span>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="text-center mb-4">
                        <div className="text-xs">Host Order ID: QMQUBMGIWXKB</div>
                        <div className="text-xs mt-2">Take one min survey @ tellsubway.in and get</div>
                        <div className="text-xs">a free cookie on next purchase.</div>
                    </div>

                    {/* Watermark */}
                    <div className="text-center text-xs text-gray-400 mb-2">
                        Created with Receipt
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SubwayReceipt;