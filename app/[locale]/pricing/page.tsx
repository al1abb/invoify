"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PricingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Free Receipt Generator
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-8">
                            Create professional receipts and invoices completely free. No payment required.
                        </p>
                    </div>

                    {/* Single Free Plan */}
                    <div className="grid grid-cols-1 max-w-md mx-auto mb-20">
                        <div className="relative bg-white rounded-3xl border-2 border-blue-600 overflow-hidden shadow-xl">
                            <div className="p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free Forever</h3>
                                <p className="text-sm text-muted-foreground mb-6">Everything you need to create receipts</p>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">$0</span>
                                        <span className="text-gray-600">/forever</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        All features included, no limits
                                    </p>
                                </div>

                                <Link href="/">
                                    <Button
                                        className="w-full py-6 rounded-xl font-medium text-base bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                                    >
                                        Start Creating Receipts
                                    </Button>
                                </Link>

                                <ul className="mt-8 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">All receipt templates</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">PDF export</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">PNG image export</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Custom branding</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">No watermarks</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Unlimited receipts</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PricingPage;