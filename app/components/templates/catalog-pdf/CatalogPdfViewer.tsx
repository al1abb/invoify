"use client";

// Components
import  CatalogLivePreview  from "./CatalogLivePreview";
import { FinalPdf } from "@/app/components";

// Contexts
import { useCatalogContext } from "@/contexts/CatalogContext";

// Types
import { ProductCatalogData } from "./catalog_contant";

type CatalogPdfViewerProps = {
    data: ProductCatalogData;
};

const CatalogPdfViewer = ({ data }: CatalogPdfViewerProps) => {
    const { catalogPdf } = useCatalogContext();

    return (
        <div className="my-3">
            {catalogPdf.size == 0 ? (
                <CatalogLivePreview data={data} />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default CatalogPdfViewer;
