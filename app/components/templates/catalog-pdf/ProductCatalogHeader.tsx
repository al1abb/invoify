import { CatalogCompanyInfo } from "./catalog_contant";

export function PdfHeader({ company }: { company: CatalogCompanyInfo }) {
    return (
        <div 
            id="catalog-header" 
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                gap: 12,
                width:"100%",
                
                borderBottom: "1px solid rgba(0,0,0,0.3)",
                padding:"10px 0",
                color: "#000",
            }}
        >
            <div 
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    gridColumn: "span 1",
                }}
            >
                {company.logoUrl ? (
                    <img 
                        src={company.logoUrl} 
                        alt={company.legalName} 
                        style={{
                            width: 100,
                            height: 50,
                            objectFit: "contain",
                        }} 
                    />
                ) : (
                    <div 
                        style={{
                            width: 100,
                            height: 50,
                            backgroundColor: "#1f2937", // bg-gray-900
                            color: "#fff", // text-white
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700, // font-bold
                        }}
                    >
                        LOGO
                    </div>
                )}
            </div>
            <div 
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12, // text-xs
                    gridColumn: "span 2",
                }}
            >
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