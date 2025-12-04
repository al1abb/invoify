"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const receiptTemplates = [
    {
        id: 1,
        title: "Fast Food Receipt",
        preview: "HARBOR LANE CAFE\n3911 GREEN OAKS BLVD\nCHICAGO IL\n\n5318\nMar 8, 2017     6:25 PM\nBATCH #507327\nAPPR: 859000\nTRANS #:3\nVISA 4408\n\n2         Sandwiches        $10\n1    Fried Chicken         $20\n1    Cheeseburgers        $15\n1         Tacos            $30\n\nSUBTOTAL              $85.00\nTAX                   $6.50\nTOTAL                 $93.50\n\nTIP              $20\n\nTOTAL           $113.50\n\n      APPROVED\n      THANKYOU\n    CUSTOMER COPY",
        category: "fast-food"
    },
    {
        id: 5,
        title: "Starbucks Receipt",
        preview: "⭐ STARBUCKS\nCoffee Company\n\nStore # 47089\n123 Main Street\nSeattle, WA 98101\nPhone: (206) 555-0123\n\nCHK 742896\n11/19/2025 12:34:56 PM\nCashier: Sarah M\nRegister: 1\n\nORDER #47089-240\nFor Here\nMobile Order & Pay\n\nGrande Pike Place Roast\n• No Room\n• Hot                     $2.45\n\nBlueberry Muffin\n• Warmed                 $3.25\n\nVenti Iced Caramel Macchiato\n• 2% Milk\n• Extra Hot\n• 2 Pumps Vanilla        $5.75\n\nSubtotal                 $11.45\nTax                       $1.03\nTotal                    $12.48\n\nVisa Credit **** 4567    $12.48\n\n⭐ STARBUCKS REWARDS ⭐\nBalance before: 125 Stars\nStars earned: +25\nCurrent balance: 150 Stars\n\nThank you for visiting!\nRate your experience at\nmystarbucksvisit.com",
        category: "coffee",
        data: {
            storeName: "Starbucks Store # 47089",
            phone: "(206) 555-0123",
            storeAddress: "123 Main Street, Seattle, WA 98101",
            date: "2025-11-19",
            time: "12:34:56",
            cashier: "Sarah M",
            registerNumber: "Register: 1",
            orderNumber: "ORDER #47089-240",
            items: [
                { id: "1", name: "Grande Pike Place Roast", quantity: 1, price: 2.45, notes: "No Room, Hot" },
                { id: "2", name: "Blueberry Muffin", quantity: 1, price: 3.25, notes: "Warmed" },
                { id: "3", name: "Venti Iced Caramel Macchiato", quantity: 1, price: 5.75, notes: "2% Milk, Extra Hot, 2 Pumps Vanilla" }
            ],
            subtotal: 11.45,
            tax: 1.03,
            total: 12.48,
            paymentMethod: "Visa Credit **** 4567",
            rewardsInfo: {
                previousBalance: 125,
                starsEarned: 25,
                currentBalance: 150
            },
            customMessages: {
                bottom: "Thank you for visiting! Rate your experience at mystarbucksvisit.com"
            }
        }
    },
    {
        id: 2,
        title: "Coffee Receipt",
        preview: "Coffee House\n325 W 49th\nAustin, TX        (333)321-3333\n\nCHK  567141\n02/17/2017  09:13 AM\nG8372   Drawer#1  Rcpt#\n\nAmericano                    $3.74\nSteamed Milk                 $1.00\n\n*********************\nSUBTOTAL               $4.78\nTAX                    $0.30\nTOTAL                  $4.78\nCHANGE DUE             $0.00\n\n*********************\n02/17/2017  09:13 AM\n\nGet your 10th cup free! Join\nour frequent Coffee Club\nonline.",
        category: "coffee"
    },
    {
        id: 3,
        title: "McDonald's Receipt",
        preview: "146\nBUY ONE GET ONE FREE QUARTER POUNDER\nCHEESE OR LEGO MCEASTER\n\nGo to www.mcdonalds.com within 7\ndays and tell us about your visit\n\nSurvey Code: #146097\nExpires 30 days after receipt date\n\nVisit us again soon!\nGracias por preferir McDonald's\n\nOur food\nNYAJ\n\nTel # (254) 457 3679  Store # 660637\n\nKS # 1        Nov 5, 2024 (Wed) 13:10\n\nPOS Order # 31\n\nQTY  Item                     TOTAL\n2    Big Mac                    5.20\n     AKO 3 Mustard Packet\n2    Iced Coffee                2.16\n\nSUBTOTAL                      14.96\nTax                            1.20",
        category: "fast-food"
    },
    {
        id: 4,
        title: "Subway Receipt",
        preview: "        [SUBWAY LOGO]\n\nSubway #44352-7 Phone 3136253957\n3680 Avenue of the Cities,\nMoline, IL 61265, United States\nServed by: Mariana 04/27 2025 16:04:52\nTerm ID-Trans# 5/A - 300236\n\nQty  Size  Item             Price\n---  ----  ----             -----\n1    12\"   Steak & Cheese Sub  5.00\n\n2    12\"   #6 The Boss Sub    24.76\n\nSub Total                   54.56\nGeneral Sales Tax GST (10%)  5.46\nTotal (Eat In)             60.02\nVisa                       60.02\nChange                      0.00\n\nTake one min survey @ tellsubway.in and get a free\ncookie on next purchase.",
        category: "fast-food",
        data: {
            storeName: "Subway #44352-7",
            phone: "3136253957",
            storeAddress: "3680 Avenue of the Cities, Moline, IL 61265, United States",
            date: "2025-04-27",
            time: "16:04:52",
            cashier: "Mariana",
            registerNumber: "Term ID-Trans# 5/A - 300236",
            items: [
                { id: "1", name: "Steak & Cheese Sub", quantity: 1, price: 5.00, size: "12\"" },
                { id: "2", name: "#6 The Boss Sub", quantity: 2, price: 12.38, size: "12\"" }
            ],
            subtotal: 54.56,
            tax: 5.46,
            total: 60.02,
            paymentMethod: "Visa",
            customMessages: {
                bottom: "Take one min survey @ tellsubway.in and get a free cookie on next purchase."
            }
        }
    },
    {
        id: 6,
        title: "Uber Eats Receipt",
        preview: "Your order\nOrder #1842-6534\nNov 19, 2025 at 3:45 PM\n\nMcDonald's\n123 Main Street\nSeattle, WA 98101\n\nDelivered to\nSarah Johnson\n456 Pine Avenue, Apt 2B\n\nItems\n1x Big Mac                    $6.49\n1x Large Fries                $3.29\n1x Coca-Cola (Large)          $2.19\n\nSubtotal                     $11.97\nDelivery Fee                  $1.99\nService Fee                   $0.99\nTax                           $1.32\nTip                           $3.00\n\nTotal                        $19.27\n\nPayment method\nVisa ••••4567\n\nDelivery partner\nMichael R. ⭐ 4.9",
        category: "delivery",
        data: {
            orderNumber: "1842-6534",
            date: "2025-11-19",
            time: "15:45",
            restaurant: "McDonald's",
            restaurantAddress: "123 Main Street, Seattle, WA 98101",
            customerName: "Sarah Johnson",
            deliveryAddress: "456 Pine Avenue, Apt 2B, Seattle, WA 98102",
            items: [
                { id: "1", name: "Big Mac", quantity: 1, price: 6.49, notes: "No pickles, Extra sauce" },
                { id: "2", name: "Large Fries", quantity: 1, price: 3.29 },
                { id: "3", name: "Coca-Cola", quantity: 1, price: 2.19, notes: "Large" }
            ],
            subtotal: 11.97,
            deliveryFee: 1.99,
            serviceFee: 0.99,
            tax: 1.32,
            tip: 3.00,
            total: 19.27,
            paymentMethod: "Visa ••••4567",
            driverInfo: {
                name: "Michael R.",
                rating: 4.9,
                deliveries: 1247
            }
        }
    },
    {
        id: 7,
        title: "Popeyes Receipt",
        preview: "POPEYES\nLOUISIANA KITCHEN\n\nStore #2347\n892 Canal Street\nNew Orleans, LA 70112\n\nReceipt #4729815\n11/19/2025 2:18:42 PM\nCashier: Marcus T.\n\nDINE IN\nTable #12\n\n2PC Chicken Combo           $8.99\n• Spicy\n• Mashed Potatoes & Gravy\n• Large Coke\n\nChicken Sandwich Deluxe     $6.49\n• Spicy Mayo\n• Pickles\n\nRed Beans & Rice            $3.79\n• Large\n\nBiscuit                     $2.38\n• 2 Pieces\n• Honey Butter\n\nSubtotal                   $21.65\nTax                         $2.17\nTotal                      $23.82\n\n🔥 POPEYES REWARDS 🔥\nPoints earned: +238\nTotal Points: 1,847",
        category: "fast-food",
        data: {
            storeName: "Popeyes Store #2347",
            phone: "(504) 593-2847",
            storeAddress: "892 Canal Street, New Orleans, LA 70112",
            date: "2025-11-19",
            time: "14:18:42",
            cashier: "Marcus T.",
            registerNumber: "Receipt #4729815",
            orderNumber: "ORDER #238",
            items: [
                { id: "1", name: "2PC Chicken Combo", quantity: 1, price: 8.99, notes: "Spicy, Mashed Potatoes & Gravy, Large Coke" },
                { id: "2", name: "Chicken Sandwich Deluxe", quantity: 1, price: 6.49, notes: "Spicy Mayo, Pickles" },
                { id: "3", name: "Red Beans & Rice", quantity: 1, price: 3.79, notes: "Large" },
                { id: "4", name: "Biscuit", quantity: 2, price: 1.19, notes: "Honey Butter" }
            ],
            subtotal: 21.65,
            tax: 2.17,
            total: 23.82,
            paymentMethod: "Mastercard ****2847",
            rewardsInfo: {
                pointsEarned: 238,
                totalPoints: 1847,
                rewardAvailable: "$5 Reward Available!"
            },
            customMessages: {
                bottom: "Tell us about your visit at tellpopeyes.com | Survey code: 2347-238-4729815"
            }
        }
    },
    {
        id: 8,
        title: "Walmart Receipt",
        preview: "See back of receipt for your chance\nto win $1000\n\nID #: 72XXZ523GBA\n\nWalmart ✧\nSave money. Live better.\n\n(915) 968 - 2258\nMANAGER RENE PUENTES\n3451 TRUXEL RD\nSACRAMENTO CA 23456\n\nST# 01234 OP# 567890 TE# 23\nPRODUCT SERIAL # TH66B3C1ZZ\n\n1 ALIBEISS CLEANING WIPES    $8.99\n\nSubtotal                     $8.99\nTax                          $0.72\nTotal                        $9.71\n\nCash                         $10\nChange                       $0.29\n\n# ITEMS SOLD 1\n\nTC# 4891 4435 7070 5637 2915\n\n11/19/2025 3:24:15 PM\nCashier: JENNIFER L.\n\nThank you for shopping at Walmart!\nJoin Walmart+ for free delivery",
        category: "retail",
        data: {
            storeName: "Walmart",
            phone: "(915) 968-2258",
            storeAddress: "3451 TRUXEL RD, SACRAMENTO CA 23456",
            date: "2025-11-19",
            time: "15:24:15",
            cashier: "JENNIFER L.",
            registerNumber: "ST# 01234 OP# 567890 TE# 23",
            manager: "RENE PUENTES",
            items: [
                { id: "1", name: "ALIBEISS CLEANING WIPES", quantity: 1, price: 8.99, serial: "TH66B3C1ZZ" }
            ],
            subtotal: 8.99,
            tax: 0.72,
            total: 9.71,
            paymentMethod: "Cash",
            cashPaid: 10.00,
            change: 0.29,
            itemsSold: 1,
            transactionCode: "4891 4435 7070 5637 2915",
            contestId: "72XXZ523GBA",
            customMessages: {
                top: "See back of receipt for your chance to win $1000",
                bottom: "Thank you for shopping at Walmart! Save time and money with Walmart+"
            }
        }
    },
    {
        id: 9,
        title: "StockX Receipt",
        preview: "StockX | NOW YOU KNOW\n2025-11-19\n\nPeter Vincent\n1205 Ocean Breeze Ave\nSanta Monica, CA 91092\n\nOrder Number: 76425439-73784585\n\nJordan 1 Retro Low OG SP\n\nU.S Men's Size               11\nColorway    Dark Mocha/Black/Velvet Brown\nStyle                  DM7866-202\nCondition         New, 100% authentic\n\nPurchase Price             $219.00\nTax (Incl. above)          $15.25\nProcessing Fee             $29.95\nShipping                   $17.45\nTotal                     $266.40\n\n✅ VERIFIED AUTHENTIC\nPlease inspect item. All claims null\nand void if StockX verified authentic\ntag is removed.\n\nStockX LLC\n1046 Woodward Ave, Detroit, MI 48226",
        category: "ecommerce",
        data: {
            storeName: "StockX",
            customerName: "Peter Vincent",
            customerAddress: "1205 Ocean Breeze Ave, Santa Monica, CA 91092",
            orderNumber: "76425439-73784585",
            date: "2025-11-19",
            productName: "Jordan 1 Retro Low OG SP",
            productDetails: {
                size: "11",
                colorway: "Dark Mocha/Black/Velvet Brown",
                style: "DM7866-202",
                condition: "New, 100% authentic"
            },
            pricing: {
                purchasePrice: 219.00,
                tax: 15.25,
                processingFee: 29.95,
                shipping: 17.45,
                total: 266.40
            },
            authentication: "VERIFIED AUTHENTIC",
            companyInfo: {
                name: "StockX LLC",
                address: "1046 Woodward Ave, Detroit, MI 48226",
                email: "support@stockx.com",
                website: "stockx.com"
            }
        }
    },
    {
        id: 10,
        title: "Panera Bread",
        preview: "Panera Bread\n1551 US-1, Edison,\nNJ 08817,\nUnited States\nPhone: 700-584-1854\n\nAccuracy Matters\nYour order should be correct every time.\nIf it's not, we'll fix it right away, and\neven give you a free treat for your trouble.",
        category: "fast-food"
    },
    {
        id: 11,
        title: "Louis Vuitton Receipt",
        preview: "LOUIS VUITTON\nMAISON FONDÉE EN 1854\n\nLouis Vuitton Beverly Hills\n295 N Rodeo Dr\nBeverly Hills, CA 90210\n\nReceipt No: LV240119001\nNovember 19, 2025\nSales Associate: Marie Dubois\nCustomer: Ms. Johnson\n\nNeverfull MM Monogram Canvas\nStyle: M41175\nQty: 1                    $1,960.00\n\nTwist PM Epi Leather\nStyle: M50282\nQty: 1                    $4,400.00\n\nSubtotal:                 $6,360.00\nTax:                        $636.00\nTotal:                    $6,996.00\n\nPayment: American Express ****1006\n\nCERTIFICATE OF AUTHENTICITY\nThis Louis Vuitton product is guaranteed authentic.\n\nMerci • Thank You • ありがとうございます",
        category: "luxury",
        data: {
            storeName: "Louis Vuitton Beverly Hills",
            storeAddress: "295 N Rodeo Dr, Beverly Hills, CA 90210",
            phone: "(310) 859-0457",
            date: "2025-11-19",
            time: "14:30:00",
            cashier: "Marie Dubois",
            registerNumber: "Receipt No: LV240119001",
            customerName: "Ms. Johnson",
            items: [
                { id: "1", name: "Neverfull MM Monogram Canvas", quantity: 1, price: 1960.00, notes: "Style: M41175 | Color: Monogram" },
                { id: "2", name: "Twist PM Epi Leather", quantity: 1, price: 4400.00, notes: "Style: M50282 | Color: Noir (Black)" }
            ],
            subtotal: 6360.00,
            tax: 636.00,
            total: 6996.00,
            paymentMethod: "American Express ****1006",
            customMessages: {
                top: "MAISON FONDÉE EN 1854",
                middle: "CERTIFICATE OF AUTHENTICITY - This Louis Vuitton product is guaranteed authentic.",
                bottom: "Merci • Thank You • ありがとうございます - We appreciate your visit to Louis Vuitton"
            },
            barcode: "LV240119001",
            fontStyle: "font1"
        }
    }
];

const ReceiptTemplatesGrid = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params.locale as string || "en";
    const [selectedCategory, setSelectedCategory] = useState("All Templates");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            switch(category) {
                case 'fast-food':
                    setSelectedCategory("Fast Food Invoice Templates");
                    break;
                case 'retail':
                    setSelectedCategory("Retail Receipt Templates");
                    break;
                case 'invoices':
                    setSelectedCategory("Invoice Templates");
                    break;
                default:
                    setSelectedCategory("All Templates");
            }
        } else {
            setSelectedCategory("All Templates");
        }
    }, [searchParams]);

    const filteredTemplates = () => {
        const category = searchParams.get('category');
        let templates = receiptTemplates;
        
        // Filter by category first
        if (category) {
            switch(category) {
                case 'fast-food':
                    templates = templates.filter(t => 
                        t.category === 'fast-food' || t.category === 'coffee'
                    );
                    break;
                case 'retail':
                    templates = templates.filter(t => 
                        t.category === 'retail' || t.category === 'ecommerce' || 
                        t.category === 'luxury' || t.category === 'delivery'
                    );
                    break;
                case 'invoices':
                    templates = templates.filter(t => 
                        t.category === 'invoice'
                    );
                    break;
                default:
                    break;
            }
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            templates = templates.filter(t => 
                t.title.toLowerCase().includes(query) ||
                (t.preview && t.preview.toLowerCase().includes(query))
            );
        }
        
        return templates;
    };

    const getTemplateLink = (templateId: number) => {
        switch (templateId) {
            case 3:
                return `/receipt-builder?template=3`;
            case 4:
                return `/fastfood/subway`;
            case 5:
                return `/fastfood/starbucks`;
            case 6:
                return `/delivery/uber-eats`;
            case 7:
                return `/fastfood/popeyes`;
            case 8:
                return `/retail/walmart`;
            case 9:
                return `/retail/stockx`;
            case 11:
                return `/luxury/louis-vuitton`;
            default:
                return `/receipt-builder`;
        }
    };

    return (
        <div className="flex-1 p-3 md:p-6">
            <div className="mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {selectedCategory}
                    </h1>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search Receipt"
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredTemplates().map((template) => (
                    <Link 
                        key={template.id} 
                        href={getTemplateLink(template.id)}
                    >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                            <CardContent className="p-3 md:p-4">
                                <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 relative">

                                    {template.id === 4 ? (
                                        <div className="text-xs font-mono leading-tight text-black">
                                            {/* Subway Logo */}
                                            <div className="text-center mb-3">
                                                <Image 
                                                    src="/assets/favicon/subway.png" 
                                                    alt="Subway" 
                                                    width={80} 
                                                    height={20} 
                                                    className="mx-auto"
                                                />
                                            </div>
                                            
                                            <div className="border-b border-black mb-3"></div>
                                            
                                            <div className="text-center text-xs mb-3">
                                                <div>Subway #21365-0 Phone 3176666728</div>
                                                <div>3680 Avenue of the Cities, Moline,</div>
                                                <div>IL 61265, United States</div>
                                                <div>Served by : Mariana 12/15/2025 18:34:18</div>
                                                <div>Term ID-Trans# 9/A - 689172</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-xs">
                                                    <span>Qty   Size  Item</span>
                                                    <span>Price</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>----  ----  ----</span>
                                                    <span>-----</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>1     1"    CHEESY PANEER TIKKA</span>
                                                    <span className="ml-auto">5.00</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between">
                                                    <span>Sub Total</span>
                                                    <span>5.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>General Sales Tax GST (10%)</span>
                                                    <span>0.50</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Total (Eat In)</span>
                                                    <span>5.50</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>VISA</span>
                                                    <span>5.50</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Change</span>
                                                    <span>0.00</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs mb-2">
                                                <div>Host Order ID : EYHMVUDYTF73</div>
                                            </div>
                                            
                                            <div className="text-xs">
                                                <div>Take one min survey @ tellsubway.in and get</div>
                                                <div>a free cookie on next purchase.</div>
                                            </div>
                                        </div>
                                    ) : template.id === 5 ? (
                                        <div className="text-xs font-mono leading-tight text-black">
                                            {/* Starbucks Logo */}
                                            <div className="text-center mb-3">
                                                <Image 
                                                    src="/assets/favicon/start bug.png" 
                                                    alt="Starbucks" 
                                                    width={80} 
                                                    height={25} 
                                                    className="mx-auto mb-1"
                                                />
                                                <div className="text-green-600 font-semibold text-xs">
                                                    Coffee Company
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs mb-3">
                                                <div className="font-bold">Store # 47089</div>
                                                <div>123 Main Street</div>
                                                <div>Seattle, WA 98101</div>
                                            </div>
                                            
                                            <div className="text-center text-xs mb-3">
                                                <div>CHK 742896</div>
                                                <div>11/19/2025 12:34:56 PM</div>
                                                <div>Cashier: Sarah M</div>
                                            </div>
                                            
                                            <div className="border-t border-dashed border-black my-2"></div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="font-bold text-xs">ORDER #47089-240</div>
                                                <div className="text-xs">Mobile Order & Pay</div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-3">
                                                <div className="flex justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-xs">Grande Pike Place</div>
                                                        <div className="text-xs text-gray-600">• No Room</div>
                                                    </div>
                                                    <div className="text-xs">$2.45</div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-xs">Blueberry Muffin</div>
                                                        <div className="text-xs text-gray-600">• Warmed</div>
                                                    </div>
                                                    <div className="text-xs">$3.25</div>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-dashed border-black my-2"></div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span>$11.45</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax</span>
                                                    <span>$1.03</span>
                                                </div>
                                                <div className="flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span>$12.48</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs text-green-600">
                                                <div className="font-bold">⭐ REWARDS ⭐</div>
                                                <div>Current: 150 Stars</div>
                                            </div>
                                        </div>
                                    ) : template.id === 6 ? (
                                        <div className="text-xs font-sans leading-tight text-black">
                                            {/* Uber Eats Logo */}
                                            <div className="text-center mb-3">
                                                <Image 
                                                    src="/assets/favicon/ubre.png" 
                                                    alt="Uber Eats" 
                                                    width={90} 
                                                    height={25} 
                                                    className="mx-auto mb-2"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2 mb-3">
                                                <div className="font-bold text-sm">Your order</div>
                                                <div className="text-xs text-gray-600">Order #1842-6534</div>
                                                <div className="text-xs text-gray-600">Nov 19, 2025 at 3:45 PM</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="font-semibold text-xs">McDonald's</div>
                                                <div className="text-xs text-gray-600">123 Main Street</div>
                                                <div className="text-xs text-gray-600">Seattle, WA 98101</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-xs">
                                                    <span>1x Big Mac</span>
                                                    <span>$6.49</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>1x Large Fries</span>
                                                    <span>$3.29</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>1x Coca-Cola</span>
                                                    <span>$2.19</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Subtotal</span>
                                                    <span>$11.97</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Delivery Fee</span>
                                                    <span>$1.99</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>Total</span>
                                                    <span>$19.27</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs text-gray-600 mt-2">
                                                <div>Michael R. ⭐ 4.9</div>
                                            </div>
                                        </div>
                                    ) : template.id === 7 ? (
                                        <div className="text-xs font-mono leading-tight text-black">
                                            {/* Popeyes Logo */}
                                            <div className="text-center mb-3">
                                                <Image 
                                                    src="/assets/favicon/popeys.jpeg" 
                                                    alt="Popeyes" 
                                                    width={90} 
                                                    height={35} 
                                                    className="mx-auto mb-1"
                                                />
                                                <div className="text-orange-600 font-bold text-xs">
                                                    LOUISIANA KITCHEN
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="font-bold text-xs">Store #2347</div>
                                                <div className="text-xs text-gray-600">892 Canal Street</div>
                                                <div className="text-xs text-gray-600">New Orleans, LA 70112</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="text-xs">Receipt #4729815</div>
                                                <div className="text-xs">11/19/2025 2:18 PM</div>
                                                <div className="font-bold text-xs">DINE IN - Table #12</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-xs">
                                                    <span>2PC Chicken Combo</span>
                                                    <span>$8.99</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Chicken Sandwich</span>
                                                    <span>$6.49</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Red Beans & Rice</span>
                                                    <span>$3.79</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Subtotal</span>
                                                    <span>$21.65</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>Total</span>
                                                    <span>$23.82</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs text-orange-600 mt-2">
                                                <div className="font-bold">🔥 REWARDS 🔥</div>
                                                <div>Points: 1,847</div>
                                            </div>
                                        </div>
                                    ) : template.id === 8 ? (
                                        <div className="text-xs font-mono leading-tight text-black">
                                            {/* Contest Header */}
                                            <div className="text-center mb-2 text-xs">
                                                <div>Win $1000</div>
                                                <div>ID: 72XXZ523GBA</div>
                                            </div>
                                            
                                            {/* Walmart Logo */}
                                            <div className="text-center mb-3">
                                                <div className="text-blue-600 font-bold text-lg">
                                                    Walmart ✧
                                                </div>
                                                <div className="text-xs font-semibold">
                                                    Save money. Live better.
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="text-xs text-center">
                                                    MANAGER RENE PUENTES
                                                </div>
                                                <div className="text-xs text-center">
                                                    3451 TRUXEL RD
                                                </div>
                                                <div className="text-xs text-center">
                                                    SACRAMENTO CA 23456
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-xs">
                                                    <span>CLEANING WIPES</span>
                                                    <span>$8.99</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Subtotal</span>
                                                    <span>$8.99</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Tax</span>
                                                    <span>$0.72</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>Total</span>
                                                    <span>$9.71</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Cash</span>
                                                    <span>$10</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Change</span>
                                                    <span>$0.29</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs mt-2">
                                                <div>JENNIFER L.</div>
                                                <div>11/19/2025 3:24 PM</div>
                                            </div>
                                        </div>
                                    ) : template.id === 9 ? (
                                        <div className="text-xs font-sans leading-tight text-black">
                                            {/* StockX Preview */}
                                            <div className="bg-black text-white p-2 mb-2 text-center relative">
                                                <Image 
                                                    src="/assets/favicon/stock.png" 
                                                    alt="StockX" 
                                                    width={50} 
                                                    height={15} 
                                                    className="mx-auto mb-1"
                                                />
                                                <div className="text-xs font-bold">
                                                    NOW YOU KNOW
                                                </div>
                                                <div className="absolute top-1 right-2 text-xs">
                                                    2025-11-19
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                                <div className="font-semibold text-xs">Peter Vincent</div>
                                                <div className="text-xs text-gray-600">
                                                    1205 Ocean Breeze Ave
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Santa Monica, CA 91092
                                                </div>
                                            </div>
                                            
                                            <div className="mb-2">
                                                <div className="font-bold text-xs mb-1">
                                                    Jordan 1 Retro Low OG SP
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Size: 11 | DM7866-202
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Purchase Price</span>
                                                    <span>$219.00</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Processing Fee</span>
                                                    <span>$29.95</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Shipping</span>
                                                    <span>$17.45</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold border-t pt-1">
                                                    <span>Total</span>
                                                    <span>$266.40</span>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-green-50 border border-green-200 p-1 text-center">
                                                <div className="text-green-800 text-xs font-bold">
                                                    ✅ VERIFIED AUTHENTIC
                                                </div>
                                            </div>
                                        </div>
                                    ) : template.id === 11 ? (
                                        <div className="text-xs font-serif leading-tight text-black">
                                            {/* Louis Vuitton Preview */}
                                            <div className="text-center mb-4">
                                                <div className="text-lg font-bold tracking-widest text-black mb-1">
                                                    LOUIS VUITTON
                                                </div>
                                                <div className="text-xs text-gray-600 tracking-wide">
                                                    MAISON FONDÉE EN 1854
                                                </div>
                                            </div>
                                            
                                            <div className="text-center mb-3 space-y-1">
                                                <div className="font-semibold text-xs">Louis Vuitton Beverly Hills</div>
                                                <div className="text-xs text-gray-600">295 N Rodeo Dr</div>
                                                <div className="text-xs text-gray-600">Beverly Hills, CA 90210</div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3 border-t border-b border-gray-200 py-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Receipt No:</span>
                                                    <span>LV240119001</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Sales Associate:</span>
                                                    <span>Marie Dubois</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-3">
                                                <div>
                                                    <div className="font-semibold text-xs">Neverfull MM</div>
                                                    <div className="text-xs text-gray-600">Style: M41175</div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>Qty: 1</span>
                                                        <span>$1,960.00</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-xs">Twist PM</div>
                                                    <div className="text-xs text-gray-600">Style: M50282</div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>Qty: 1</span>
                                                        <span>$4,400.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-200 pt-2 space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>Subtotal:</span>
                                                    <span>$6,360.00</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span>Tax:</span>
                                                    <span>$636.00</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold border-t pt-1">
                                                    <span>Total:</span>
                                                    <span>$6,996.00</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center text-xs text-gray-600 mt-2">
                                                <div className="font-semibold">CERTIFICATE OF AUTHENTICITY</div>
                                                <div>Merci • Thank You</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs font-mono leading-tight text-gray-700 whitespace-pre-line">
                                            {template.preview}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-800 text-xs md:text-sm">
                                        {template.title}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ReceiptTemplatesGrid;