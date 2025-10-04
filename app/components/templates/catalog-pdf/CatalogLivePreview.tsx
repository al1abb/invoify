// Components
import { Subheading } from "@/app/components";
import ProductCatalogTemplate from "./ProductCatalogTemplate";

// Types
import { ProductCatalogData } from "./catalog_contant";

type CatalogLivePreviewProps = {
    data: ProductCatalogData;
};

export default function CatalogLivePreview({ data }: CatalogLivePreviewProps) {
    return (
        <>
            <Subheading>Live Preview:</Subheading>
            <div className="border dark:border-gray-600 rounded-xl my-1 bg-white">
                <ProductCatalogTemplate {...data} />
            </div>
        </>
    );
}
