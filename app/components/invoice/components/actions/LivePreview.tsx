// Components
import { DynamicInvoiceTemplate, Subheading } from "@/app/components";

// Types
import { InvoiceType } from "@/types";

type LivePreviewProps = {
    data: InvoiceType;
};

export default function LivePreview({ data }: LivePreviewProps) {
    return (
        <>
            <Subheading>Live Preview:</Subheading>
            <div className="border dark:border-gray-600 rounded-xl my-1">
                <DynamicInvoiceTemplate {...data} />
            </div>
        </>
    );
}
