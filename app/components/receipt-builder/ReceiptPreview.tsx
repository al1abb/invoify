"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, RefreshCw, Bookmark } from "lucide-react";
import { useReceipt } from "./ReceiptContext";

const ReceiptPreview = () => {
    const { receiptData, enabledSections, resetToDefault } = useReceipt();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleReset = () => {
        resetToDefault();
        setIsResetModalOpen(false);
    };

    const handleDownload = async () => {
        const receiptElement = document.querySelector('.receipt-card');
        if (!receiptElement) return;

        try {
            // Import html2canvas dynamically
            const html2canvas = (await import('html2canvas')).default;
            
            // Create canvas from receipt element
            const canvas = await html2canvas(receiptElement as HTMLElement, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher resolution
                useCORS: true,
                allowTaint: true,
                width: 300,
                height: 600
            });

            // Convert to image
            const imageData = canvas.toDataURL('image/png');
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${receiptData.storeName}-receipt.png`;
            link.href = imageData;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to simple text download
            const receiptText = generateReceiptText();
            const blob = new Blob([receiptText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${receiptData.storeName}-receipt.txt`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const generateReceiptText = () => {
        let text = `${receiptData.storeName}\n`;
        text += `${receiptData.date}, ${receiptData.time}\n`;
        text += `${receiptData.registerNumber}\n`;
        text += `${receiptData.cashier}\n\n`;
        
        receiptData.items.forEach(item => {
            text += `${item.quantity} ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        text += `\nSubtotal: $${receiptData.subtotal.toFixed(2)}\n`;
        text += `Tax: $${receiptData.tax.toFixed(2)}\n`;
        text += `Total: $${receiptData.total.toFixed(2)}\n\n`;
        text += `Payment: ${receiptData.paymentMethod}\n`;
        text += `Card: ${receiptData.cardNumber}\n\n`;
        text += `${receiptData.customMessages.bottom}\n`;
        text += `${receiptData.phone}`;
        
        return text;
    };

    return (
        <div className="h-screen overflow-y-auto bg-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {receiptData.storeName} Receipt
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-sm"
                            onClick={() => alert('Save feature coming soon!')}
                        >
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save as new template
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 text-sm"
                            onClick={() => setIsResetModalOpen(true)}
                        >
                            Reset
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-sm"
                            onClick={() => window.location.href = '/pricing'}
                        >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Remove watermark
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            {/* Receipt Preview */}
            <div className="p-4 flex justify-center">
                <Card className="w-64 bg-white shadow-lg relative receipt-card">
                    {/* Watermark */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Clean watermark pattern */}
                        {Array.from({ length: 6 }).map((_, i) => {
                            const row = Math.floor(i / 2);
                            const col = i % 2;
                            return (
                                <div
                                    key={i}
                                    className="absolute text-gray-400 font-semibold transform -rotate-45 select-none"
                                    style={{
                                        fontSize: '14px',
                                        opacity: '0.35',
                                        top: `${row * 100 + 30}px`,
                                        left: `${col * 100 + 10}px`,
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    RECEIPT
                                </div>
                            );
                        })}
                    </div>
                    <div className={`p-4 text-xs relative z-10 receipt-content ${
                        receiptData.fontStyle === "font2" ? "font-sans" : "font-mono"
                    }`}>
                        {/* Check if this is a Subway receipt */}
                        {receiptData.storeName.includes('Subway') ? (
                            <>
                                {/* Subway Logo */}
                                <div className="text-center mb-3">
                                    {receiptData.logo && (
                                        <Image 
                                            src={receiptData.logo} 
                                            alt="Subway" 
                                            width={120} 
                                            height={30} 
                                            className="mx-auto"
                                        />
                                    )}
                                </div>
                                
                                {/* Border line */}
                                <div className="border-b border-black mb-3"></div>
                                
                                {/* Store Info */}
                                <div className="text-center text-xs mb-3">
                                    <div>{receiptData.storeName} Phone {receiptData.phone}</div>
                                    <div>{receiptData.storeAddress}</div>
                                    <div>Served by : {receiptData.cashier.replace('Cashier: ', '')} {receiptData.date.replace(/-/g, '/')} {receiptData.time}</div>
                                    <div>{receiptData.registerNumber}</div>
                                </div>
                                
                                {/* Items header */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Qty   Size  Item</span>
                                        <span>Price</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span>----  ----  ----</span>
                                        <span>-----</span>
                                    </div>
                                    
                                    {/* Items */}
                                    {receiptData.items.map((item) => (
                                        <div key={item.id} className="flex justify-between mb-1">
                                            <span>{item.quantity}     {item.size || "1''"}    {item.name}</span>
                                            <span>{item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Totals - Subway style */}
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between">
                                        <span>Sub Total</span>
                                        <span>{receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>General Sales Tax GST (10%)</span>
                                        <span>{receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total (Eat In)</span>
                                        <span>{receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{receiptData.paymentMethod}</span>
                                        <span>{receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Change</span>
                                        <span>0.00</span>
                                    </div>
                                </div>
                                
                                {/* Host Order ID */}
                                {receiptData.customMessages.middle && (
                                    <div className="text-center text-xs mb-3">
                                        <div>{receiptData.customMessages.middle}</div>
                                    </div>
                                )}
                                
                                {/* Survey message */}
                                {receiptData.customMessages.bottom && (
                                    <div className="text-xs">
                                        <div>Take one min survey @ tellsubway.in and get</div>
                                        <div>a free cookie on next purchase.</div>
                                    </div>
                                )}
                            </>
                        ) : receiptData.storeName.includes('Starbucks') ? (
                            <>
                                {/* Starbucks Logo */}
                                <div className="text-center mb-3">
                                    <img 
                                        src="/assets/favicon/start bug.png" 
                                        alt="Starbucks" 
                                        width={80} 
                                        height={25} 
                                        className="mx-auto mb-1"
                                        onError={(e) => console.error('Logo failed to load')}
                                    />
                                    <div className="text-green-600 font-semibold text-xs">
                                        Coffee Company
                                    </div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div className="font-bold">{receiptData.storeName}</div>
                                    <div>{receiptData.storeAddress}</div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div>CHK 742896</div>
                                    <div>{receiptData.date} {receiptData.time}</div>
                                    <div>Cashier: {receiptData.cashier}</div>
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3">
                                    <div className="font-bold text-xs">ORDER #47089-240</div>
                                    <div className="text-xs">Mobile Order & Pay</div>
                                </div>
                                
                                <div className="space-y-2 mb-3">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-xs">{item.name}</div>
                                            </div>
                                            <div className="text-xs">${item.price.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="font-bold">Payment Method:</div>
                                    <div>Card number: {receiptData.cardNumber}</div>
                                    <div>Card type: {receiptData.paymentMethod}</div>
                                    <div>Status: APPROVED</div>
                                </div>
                                
                                {receiptData.customMessages.bottom && (
                                    <div className="text-center text-xs mb-3">
                                        <div>{receiptData.customMessages.bottom}</div>
                                        <div className="mt-2">{receiptData.phone}</div>
                                    </div>
                                )}
                            </>
                        ) : receiptData.storeName.includes('McDonald') ? (
                            <>
                                {/* Uber Eats / McDonald's Layout */}
                                <div className="text-center mb-3">
                                    {receiptData.logo && (
                                        <img 
                                            src={receiptData.logo} 
                                            alt="Uber Eats" 
                                            width={90} 
                                            height={25} 
                                            className="mx-auto mb-2"
                                        />
                                    )}
                                    <div className="text-black font-bold text-sm">Order #{receiptData.registerNumber.replace('Order #', '')}</div>
                                    <div className="text-xs text-gray-600">{receiptData.storeName}</div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div>{receiptData.storeAddress}</div>
                                    <div>{receiptData.date} at {receiptData.time}</div>
                                </div>
                                
                                <div className="border-t border-black my-2"></div>
                                
                                <div className="space-y-2 mb-3">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-xs">
                                            <span>{item.quantity} {item.name}</span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="text-xs mb-3">
                                    <div className="font-bold">Delivery Details:</div>
                                    <div>{receiptData.customMessages.middle}</div>
                                    <div className="mt-1">{receiptData.customMessages.bottom}</div>
                                </div>
                                
                                <div className="text-center text-xs">
                                    <div>Payment: {receiptData.paymentMethod}</div>
                                </div>
                            </>
                        ) : receiptData.storeName.includes('Popeyes') ? (
                            <>
                                {/* Popeyes Layout */}
                                <div className="text-center mb-3">
                                    {receiptData.logo && (
                                        <img 
                                            src={receiptData.logo} 
                                            alt="Popeyes" 
                                            width={90} 
                                            height={35} 
                                            className="mx-auto mb-1"
                                        />
                                    )}
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div className="font-bold">{receiptData.storeName}</div>
                                    <div>{receiptData.storeAddress}</div>
                                    <div>{receiptData.phone}</div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div>{receiptData.registerNumber}</div>
                                    <div>{receiptData.date} {receiptData.time}</div>
                                    <div>Cashier: {receiptData.cashier}</div>
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="text-xs mb-3">
                                    <div>{receiptData.customMessages.middle}</div>
                                </div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span>{item.quantity} {item.name}</span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-dashed border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="text-center text-xs">
                                    <div>Payment: {receiptData.paymentMethod}</div>
                                    <div className="mt-2">{receiptData.customMessages.bottom}</div>
                                </div>
                            </>
                        ) : receiptData.storeName.toLowerCase().includes('walmart') ? (
                            <>
                                {/* Walmart Layout */}
                                <div className="text-xs text-blue-500 mb-1">DEBUG: Walmart template loaded, store: {receiptData.storeName}</div>
                                <div className="text-center mb-3">
                                    {receiptData.logo ? (
                                        <>
                                            <img 
                                                src={receiptData.logo} 
                                                alt="Walmart" 
                                                width={100} 
                                                height={30} 
                                                className="mx-auto mb-2"
                                                onError={(e) => {
                                                    console.error('Walmart logo failed to load:', receiptData.logo);
                                                    e.currentTarget.style.display = 'none';
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.style.display = 'block';
                                                }}
                                            />
                                            <div className="text-lg font-bold text-blue-600 mb-2" style={{ display: 'none' }}>
                                                Walmart ✧
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-lg font-bold text-blue-600 mb-2">Walmart ✧</div>
                                    )}
                                    <div className="text-xs">Save money. Live better.</div>
                                </div>
                                
                                <div className="text-center text-xs mb-2">
                                    <div>{receiptData.customMessages.top}</div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div>{receiptData.storeAddress}</div>
                                    <div>{receiptData.phone}</div>
                                </div>
                                
                                <div className="text-center text-xs mb-3">
                                    <div>{receiptData.registerNumber}</div>
                                    <div>{receiptData.date} {receiptData.time}</div>
                                    <div>{receiptData.cashier}</div>
                                </div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between">
                                                <span>{item.name}</span>
                                                <span>${item.price.toFixed(2)}</span>
                                            </div>
                                            <div className="text-gray-600 text-xs">{receiptData.customMessages.middle}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="flex justify-between">
                                        <span>SUBTOTAL</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>TAX</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>TOTAL</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{receiptData.paymentMethod}</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>CHANGE</span>
                                        <span>$0.29</span>
                                    </div>
                                </div>
                                
                                <div className="text-center text-xs">
                                    <div>{receiptData.customMessages.bottom}</div>
                                </div>
                            </>
                        ) : receiptData.storeName.includes('StockX') ? (
                            <>
                                {/* StockX Layout */}
                                <div className="bg-black text-white p-2 mb-2 text-center relative">
                                    {receiptData.logo && (
                                        <img 
                                            src={receiptData.logo} 
                                            alt="StockX" 
                                            width={50} 
                                            height={15} 
                                            className="mx-auto mb-1"
                                        />
                                    )}
                                    <div className="text-white text-xs">RECEIPT</div>
                                </div>
                                
                                <div className="text-xs mb-3">
                                    <div className="font-bold">{receiptData.registerNumber}</div>
                                    <div>{receiptData.customMessages.top}</div>
                                </div>
                                
                                <div className="space-y-2 mb-3 text-xs">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between font-semibold">
                                                <span>{item.name}</span>
                                                <span>${item.price.toFixed(2)}</span>
                                            </div>
                                            {item.id === "1" && (
                                                <div className="text-gray-600 text-xs">{receiptData.customMessages.middle}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="border-t border-black my-2"></div>
                                
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="text-xs mb-3">
                                    <div>Payment: {receiptData.paymentMethod}</div>
                                    <div>{receiptData.cardNumber}</div>
                                </div>
                                
                                <div className="text-center text-xs border border-black p-2">
                                    <div>{receiptData.customMessages.bottom}</div>
                                </div>
                            </>
                        ) : receiptData.storeName.includes('Louis Vuitton') ? (
                            <>
                                {/* Louis Vuitton Layout */}
                                <div className="text-center mb-4">
                                    <div className="text-lg font-bold tracking-widest text-black mb-1">
                                        LOUIS VUITTON
                                    </div>
                                    <div className="text-xs text-gray-600 tracking-wide">
                                        MAISON FONDÉE EN 1854
                                    </div>
                                </div>
                                
                                <div className="text-center mb-3 space-y-1 text-xs">
                                    <div className="font-semibold">{receiptData.storeName}</div>
                                    <div>{receiptData.storeAddress}</div>
                                    <div>{receiptData.phone}</div>
                                </div>
                                
                                <div className="border-t border-black mb-3"></div>
                                
                                <div className="text-xs mb-3">
                                    <div>{receiptData.registerNumber}</div>
                                    <div>{receiptData.date} {receiptData.time}</div>
                                    <div>Sales Associate: {receiptData.cashier}</div>
                                </div>
                                
                                <div className="text-xs mb-3">
                                    <div>{receiptData.customMessages.top}</div>
                                </div>
                                
                                <div className="space-y-3 mb-4 text-xs">
                                    {receiptData.items.map((item) => (
                                        <div key={item.id} className="border-b border-gray-300 pb-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>{item.name}</span>
                                                <span>${item.price.toFixed(2)}</span>
                                            </div>
                                            <div className="text-gray-600">Qty: {item.quantity}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="space-y-1 mb-4 text-xs">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${receiptData.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-black pt-1 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="text-xs mb-3">
                                    <div>Payment: {receiptData.paymentMethod}</div>
                                </div>
                                
                                <div className="text-center text-xs space-y-2">
                                    <div>{receiptData.customMessages.middle}</div>
                                    <div>{receiptData.customMessages.bottom}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Default receipt format */}
                                {enabledSections.includes('settings') && (
                                    <div className="text-center mb-3">
                                        <div className="font-bold text-sm">{receiptData.storeName}</div>
                                        {enabledSections.includes('datetime') && (
                                            <div className="text-xs mt-1">
                                                {new Date(receiptData.date).toLocaleDateString()}, {receiptData.time}
                                            </div>
                                        )}
                                        <div className="text-xs">{receiptData.registerNumber}</div>
                                        <div className="text-xs">{receiptData.cashier}</div>
                                    </div>
                                )}

                                {/* Items - only show if itemslist section is enabled */}
                                {enabledSections.includes('itemslist') && receiptData.items.length > 0 && (
                                    <>
                                        <div className="space-y-1 mb-3 text-xs">
                                            {receiptData.items.map((item) => (
                                                <div key={item.id} className="flex justify-between">
                                                    <span>{item.quantity} {item.name}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-black my-2"></div>

                                        {/* Totals */}
                                        <div className="space-y-1 text-xs mb-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>${receiptData.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Tax:</span>
                                                <span>${receiptData.tax.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between font-bold text-sm border-t border-dashed border-black pt-1 mb-3">
                                            <span>Total:</span>
                                            <span>${receiptData.total.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}

                                {/* Payment Info - only show if payment section is enabled */}
                                {enabledSections.includes('payment') && (
                                    <>
                                        <div className="border-t border-dashed border-black my-2"></div>
                                        <div className="text-xs space-y-1 mb-3">
                                            <div className="font-bold">Payment Method:</div>
                                            <div>Card number: {receiptData.cardNumber}</div>
                                            <div>Card type: {receiptData.paymentMethod}</div>
                                            <div>Status: APPROVED</div>
                                        </div>
                                    </>
                                )}

                                {/* Custom Message - only show if custom message section is enabled */}
                                {(enabledSections.includes('custommessage1') || enabledSections.includes('custommessage2')) && (
                                    <div className="text-center text-xs mb-3">
                                        <div>{receiptData.customMessages.bottom || "Please Come Again!"}</div>
                                    </div>
                                )}

                                {/* Store Address - only show if info section is enabled */}
                                {enabledSections.includes('info') && receiptData.storeAddress && (
                                    <div className="text-center text-xs mb-3">
                                        <div>{receiptData.storeAddress}</div>
                                    </div>
                                )}

                                {/* Phone - only show if store info section is enabled */}
                                {enabledSections.includes('settings') && receiptData.phone && (
                                    <div className="text-center text-xs mb-3">
                                        <div>{receiptData.phone}</div>
                                    </div>
                                )}

                                {/* Barcode - only show if barcode section is enabled */}
                                {enabledSections.includes('barcode') && (
                                    <div className="text-center text-xs mt-3">
                                        <div className="flex justify-center items-end space-x-px mb-1">
                                            {receiptData.barcode.split('').map((digit, i) => {
                                                const patterns = ['1px', '2px', '1px', '3px', '2px'];
                                                const heights = ['12px', '16px', '14px', '18px', '13px'];
                                                return (
                                                    <div 
                                                        key={i}
                                                        className="bg-black"
                                                        style={{
                                                            width: patterns[parseInt(digit) % 5] || '1px',
                                                            height: heights[parseInt(digit) % 5] || '12px'
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="font-mono text-xs">{receiptData.barcode}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Reset Confirmation Modal */}
            <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            This will reset the receipt to the default values. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-end gap-3 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsResetModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReceiptPreview;