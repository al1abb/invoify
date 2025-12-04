"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Download, Share } from "lucide-react";
import { UberEatsReceipt } from "@/app/components";

export default function UberEatsReceiptPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Uber Eats Receipt
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Professional Uber Eats-style delivery receipt template
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-8">
                        <Link href="/receipt-builder?template=6">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Receipt
                            </Button>
                        </Link>
                        
                        <Button variant="outline" className="px-6 py-2">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        
                        <Button variant="outline" className="px-6 py-2">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
                
                <UberEatsReceipt />
            </div>
        </div>
    );
}