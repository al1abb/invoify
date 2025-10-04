export type CatalogCompanyInfo = {
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

export type CatalogProduct = {
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