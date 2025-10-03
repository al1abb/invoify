import React from "react";

type CatalogCompanyInfo = {
    logoUrl?: string;
    legalName: string;
    tradeName?: string;
    city: string;
    state: string;
    gstin: string;
    contactNumber: string;
    email: string;
    registrationDate: string;
    taxpayerType: string;
    fullAddress: string;
    overview: string;
};

type CatalogProduct = {
    id: string;
    name: string;
    price: number;
    discountPercent: number; // 0-100
    images: string[]; // 4 images
    specifications: { key: string; value: string }[];
    details: string; // long description
};

export type ProductCatalogData = {
    company: CatalogCompanyInfo;
    products: CatalogProduct[];
};

// Single well-structured object that contains ALL content used in the PDF
export const PRODUCT_CATALOG_DATA: ProductCatalogData = {
    company: {
        logoUrl: "https://dummyimage.com/300x120/111/ffffff&text=LOGO",
        legalName: "Acme Manufacturing Pvt. Ltd.",
        tradeName: "Acme",
        city: "Pune",
        state: "Maharashtra",
        gstin: "27ABCDE1234F1Z5",
        contactNumber: "+91 98765 43210",
        email: "contact@acme.example",
        registrationDate: "2016-08-12",
        taxpayerType: "Regular",
        fullAddress: "Plot 21, MIDC Industrial Area, Pune, Maharashtra 411045, India",
        overview:
            "Acme is a leading manufacturer of precision-engineered consumer products. Our mission is to deliver durable, thoughtfully designed solutions that delight customers and respect the planet.",
    },
    products: [
        {
            id: "p-1001",
            name: "Aurora Desk Lamp",
            price: 2499,
            discountPercent: 15,
            images: [
                "https://dummyimage.com/600x400/222/ffffff&text=Aurora+1",
                "https://dummyimage.com/600x400/333/ffffff&text=Aurora+2",
                "https://dummyimage.com/600x400/444/ffffff&text=Aurora+3",
                "https://dummyimage.com/600x400/555/ffffff&text=Aurora+4",
            ],
            specifications: [
                { key: "Material", value: "Aluminum" },
                { key: "Dimensions", value: "18 x 12 x 42 cm" },
                { key: "Power", value: "9W LED" },
                { key: "Finish", value: "Matte Black" },
            ],
            details:
                "The Aurora Desk Lamp combines minimalist design with an articulating arm and soft-touch dimming. Built for long work sessions, it provides uniform light with excellent color accuracy.",
        },
        {
            id: "p-1002",
            name: "Nimbus Bluetooth Speaker",
            price: 3999,
            discountPercent: 20,
            images: [
                "https://dummyimage.com/600x400/223/ffffff&text=Nimbus+1",
                "https://dummyimage.com/600x400/335/ffffff&text=Nimbus+2",
                "https://dummyimage.com/600x400/447/ffffff&text=Nimbus+3",
                "https://dummyimage.com/600x400/559/ffffff&text=Nimbus+4",
            ],
            specifications: [
                { key: "Material", value: "ABS + Fabric" },
                { key: "Dimensions", value: "20 x 8 x 8 cm" },
                { key: "Battery", value: "12h Playtime" },
                { key: "Waterproof", value: "IPX5" },
            ],
            details:
                "Nimbus packs room-filling sound into a compact form. Dual passive radiators deliver rich bass while Bluetooth 5.3 ensures seamless connectivity across devices.",
        },
        {
            id: "p-1003",
            name: "Stratus Backpack",
            price: 3499,
            discountPercent: 10,
            images: [
                "https://dummyimage.com/600x400/116/ffffff&text=Stratus+1",
                "https://dummyimage.com/600x400/228/ffffff&text=Stratus+2",
                "https://dummyimage.com/600x400/33a/ffffff&text=Stratus+3",
                "https://dummyimage.com/600x400/44c/ffffff&text=Stratus+4",
            ],
            specifications: [
                { key: "Material", value: "600D Recycled Polyester" },
                { key: "Capacity", value: "24 L" },
                { key: "Laptop", value: "Fits up to 16\"" },
                { key: "Warranty", value: "2 Years" },
            ],
            details:
                "Stratus is a durable everyday backpack with a structured frame, ergonomic straps, and quick-access pockets designed for modern work and travel.",
        },
        {
            id: "p-1004",
            name: "Breeze Tower Fan",
            price: 5999,
            discountPercent: 18,
            images: [
                "https://dummyimage.com/600x400/118/ffffff&text=Breeze+1",
                "https://dummyimage.com/600x400/22a/ffffff&text=Breeze+2",
                "https://dummyimage.com/600x400/33c/ffffff&text=Breeze+3",
                "https://dummyimage.com/600x400/44e/ffffff&text=Breeze+4",
            ],
            specifications: [
                { key: "Height", value: "102 cm" },
                { key: "Modes", value: "Normal / Natural / Sleep" },
                { key: "Remote", value: "Included" },
                { key: "Noise", value: "< 45 dB" },
            ],
            details:
                "Breeze delivers efficient whole-room airflow with a slim profile and whisper-quiet operation. Ideal for bedrooms and compact spaces.",
        },
    ],
};

// Utilities
const formatCurrencyINR = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const calculateBeforeDiscount = (price: number, discountPercent: number) => {
    if (!discountPercent) return price;
    const discountedMultiplier = 1 - discountPercent / 100;
    return Math.round(price / discountedMultiplier);
};

// Header shown on each physical page (we will group pages manually to ensure repetition)
export function PdfHeader({ company }: { company: CatalogCompanyInfo }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", alignItems: "center", gap: 12, borderBottom: "1px solid #00000055", padding: "8px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.legalName} style={{ width: 140, height: 50, objectFit: "contain" }} />
                ) : (
                    <div style={{ width: 140, height: 50, background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>LOGO</div>
                )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                    <div style={{ fontWeight: 600 }}>{company.tradeName || company.legalName}</div>
                    <div>{company.city}, {company.state}</div>
                </div>
                <div>
                    <div>GSTIN: {company.gstin}</div>
                    <div>Contact: {company.contactNumber}</div>
                </div>
            </div>
        </div>
    );
}

export function ProductItem({ product }: { product: CatalogProduct }) {
    const beforeDiscount = calculateBeforeDiscount(product.price, product.discountPercent);
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, padding: 8, border: "1px solid #00000033", borderRadius: 6 }}>
            {/* Left visuals: 4 images in a grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {product.images.slice(0, 4).map((src, idx) => (
                    <div key={idx} style={{ width: "100%", aspectRatio: "4/3", borderRadius: 4, overflow: "hidden", background: "#f4f4f5" }}>
                        <img src={src} alt={`${product.name} ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                ))}
            </div>

            {/* Right core details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{product.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{formatCurrencyINR(product.price)}</span>
                        {product.discountPercent > 0 && (
                            <span style={{ fontSize: 12, color: "#047857", fontWeight: 700 }}>{product.discountPercent}% OFF</span>
                        )}
                    </div>
                    {product.discountPercent > 0 && (
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Before discount: {formatCurrencyINR(beforeDiscount)}</div>
                    )}
                </div>

                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Specifications</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                        {product.specifications.map((spec, i) => (
                            <div key={i} style={{ display: "flex", gap: 6 }}>
                                <div style={{ fontWeight: 600 }}>{spec.key}:</div>
                                <div>{spec.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ fontSize: 12, lineHeight: 1.5, color: "#111827" }}>{product.details}</div>
            </div>
        </div>
    );
}

export function CompanySummary({ company }: { company: CatalogCompanyInfo }) {
    return (
        <div style={{ display: "grid", gap: 12, padding: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>About Company</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{company.legalName}</div>
                    <div style={{ fontSize: 13, color: "#374151" }}>{company.overview}</div>
                </div>
                <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                    <div style={{ fontWeight: 700 }}>Company Legal Details</div>
                    <div>Legal Name: {company.legalName}</div>
                    {company.tradeName && <div>Trade Name: {company.tradeName}</div>}
                    <div>GSTIN: {company.gstin}</div>
                    <div>Registration Date: {company.registrationDate}</div>
                    <div>Taxpayer Type: {company.taxpayerType}</div>
                    <div>Address: {company.fullAddress}</div>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 13 }}>
                <div>Email: {company.email}</div>
                <div>Phone: {company.contactNumber}</div>
            </div>
        </div>
    );
}

// Chunk products into pages with exactly two per page
const chunkByTwo = <T,>(arr: T[]): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
    return out;
};

export default function ProductCatalogTemplate(data: ProductCatalogData = PRODUCT_CATALOG_DATA) {
    const pages = chunkByTwo(data.products);
    return (
        <div style={{ color: "#000" }}>
            <style>{`
                @page { size: A4; margin: 20px; }
                .page { page-break-after: always; break-after: page; }
                .avoid-break { break-inside: avoid; page-break-inside: avoid; }
            `}</style>

                    <div className="avoid-break">
                        <PdfHeader company={data.company} />
                    </div>
            {pages.map((pair, pageIndex) => (
                <section key={pageIndex} className="page" style={{ display: "grid", gap: 10 }}>

                    <div style={{ display: "grid", gap: 12 }}>
                        {pair.map((p) => (
                            <ProductItem key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            ))}

            {/* Final page: Company Summary */}
            <section className="page avoid-break">
                <PdfHeader company={data.company} />
                <CompanySummary company={data.company} />
            </section>
        </div>
    );
}


