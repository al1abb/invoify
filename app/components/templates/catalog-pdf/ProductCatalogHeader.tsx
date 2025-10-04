import { CatalogCompanyInfo } from "./catalog_contant";

export function PdfHeader({ company }: { company: CatalogCompanyInfo }) {
    return (
        <div className="grid grid-cols-3 items-center gap-3 border-b border-black/30 py-2">
            <div className="flex items-center gap-2 col-span-1">
                {company.logoUrl ? (
                    <img 
                        src={company.logoUrl} 
                        alt={company.legalName} 
                        className="w-[100px] h-[50px] object-contain" 
                    />
                ) : (
                    <div className="w-[100px] h-[50px] bg-gray-900 text-white flex items-center justify-center font-bold">
                        LOGO
                    </div>
                )}
            </div>
            <div className="flex justify-between text-xs col-span-2">
                <div>
                    <div className="font-semibold">{company.tradeName || company.legalName}</div>
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