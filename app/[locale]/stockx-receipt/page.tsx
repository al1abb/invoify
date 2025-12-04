"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StockXReceipt } from "@/app/components";

export default function StockXReceiptPage() {
    const params = useParams();
    const locale = params.locale as string || "en";

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header with Edit Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        StockX Receipt Template
                    </h1>
                    <Link 
                        href="/receipt-builder?template=9"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Edit This Template
                    </Link>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        StockX Authentication Receipt
                    </h2>
                    <p className="text-gray-600">
                        Professional sneaker authentication receipt template featuring StockX branding, 
                        verification details, and product authentication information. Perfect for sneaker 
                        marketplaces and authentication services.
                    </p>
                </div>

                {/* Receipt Display */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <StockXReceipt />
                </div>

                {/* Back to Templates Button */}
                <div className="mt-8 text-center">
                    <Link 
                        href="/templates"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back to Templates
                    </Link>
                </div>
            </div>
        </div>
    );
}