import React from "react";
import { CatalogCompanyInfo, CatalogProduct, PRODUCT_CATALOG_DATA, ProductCatalogData } from "./catalog_contant";
import { PdfHeader } from "./ProductCatalogHeader";
import TemplateHeaderForScreen from "../invoice-pdf/TemplateHeaderForScreen";

// Utilities
const formatCurrencyINR = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const calculateBeforeDiscount = (price: number, discountPercent: number) => {
    if (!discountPercent) return price;
    const discountedMultiplier = 1 - discountPercent / 100;
    return Math.round(price / discountedMultiplier);
};



export function ProductItem({ product }: { product: CatalogProduct }) {
    const beforeDiscount = calculateBeforeDiscount(product.price, product.discountPercent);
    return (
        <div className="grid grid-cols-2 gap-3 p-3 border border-black/20 rounded-md h-full avoid-break">
            {/* Left visuals: 4 images in a grid */}
            <div className="grid grid-cols-2 gap-2">
                {product.images.slice(0, 4).map((src, idx) => (
                    <div key={idx} className="w-full aspect-[4/3] rounded overflow-hidden bg-gray-100">
                        <img
                            src={src}
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Right core details */}
            <div className="flex flex-col gap-2 overflow-hidden">
                <div>
                    <div className="text-lg font-bold line-clamp-2">{product.name}</div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-semibold">{formatCurrencyINR(product.price)}</span>
                        {product.discountPercent > 0 && (
                            <span className="text-xs text-green-700 font-bold">{product.discountPercent}% OFF</span>
                        )}
                    </div>
                    {product.discountPercent > 0 && (
                        <div className="text-xs text-gray-500">Before discount: {formatCurrencyINR(beforeDiscount)}</div>
                    )}
                </div>

                <div>
                    <div className="text-sm font-semibold mb-1">Specifications</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                        {product.specifications.map((spec, i) => (
                            <div key={i} className="flex gap-1.5">
                                <div className="font-semibold">{spec.key}:</div>
                                <div className="truncate">{spec.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-xs leading-relaxed text-gray-900 line-clamp-3">{product.details}</div>
            </div>
        </div>
    );
}

export function CompanySummary({ company }: { company: CatalogCompanyInfo }) {
    return (
        <div className="grid gap-3 p-3 avoid-break">
            <div className="text-lg font-bold text-center">About Company</div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <div className="text-base font-bold">{company.legalName}</div>
                    <div className="text-sm text-gray-600">{company.overview}</div>
                </div>
                <div className="grid gap-1.5 text-sm">
                    <div className="font-bold">Company Legal Details</div>
                    <div>Legal Name: {company.legalName}</div>
                    {company.tradeName && <div>Trade Name: {company.tradeName}</div>}
                    <div>GSTIN: {company.gstin}</div>
                    <div>Registration Date: {company.registrationDate}</div>
                    <div>Taxpayer Type: {company.taxpayerType}</div>
                    <div>Address: {company.fullAddress}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 text-sm">
                <div>Email: {company.email}</div>
                <div>Phone: {company.contactNumber}</div>
            </div>
        </div>
    );
}

// Chunk products into pages with exactly two per page
const chunkByTwo = <T,>(arr: T[]): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += 4) out.push(arr.slice(i, i + 4));
    return out;
};

export default function ProductCatalogTemplate(data: ProductCatalogData = PRODUCT_CATALOG_DATA) {
    const pages = chunkByTwo(data.products);
    return (
        <div className="text-black">
            <style>{`
                .page { page-break-after: always; break-after: page; }
                .avoid-break { break-inside: avoid; page-break-inside: avoid; }
                .product-page { max-height: calc(100vh - 100px); }
            `}</style>

            <div className="avoid-break">
                <TemplateHeaderForScreen>
                    <PdfHeader company={data.company} />
                </TemplateHeaderForScreen>
            </div>

            {pages.map((pair, pageIndex) => (
                <section key={pageIndex} className="mt-5 gap-2.5">
                    <div className="grid gap-3 h-full">
                        {pair.map((p) => (
                            <ProductItem key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            ))}

            <CompanySummary company={data.company} />
        </div>
    );
}
