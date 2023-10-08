// Shadcn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

type PdfViewerProps = {
    pdfBlob: Blob;
};

const PdfViewer = ({ pdfBlob }: PdfViewerProps) => {
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    return (
        <>
            <p className="text-xl font-semibold my-2">PDF Preview</p>
            <AspectRatio ratio={1 / 1.4}>
                <iframe
                    className="h-full w-full"
                    src={`${pdfUrl}#toolbar=0`}
                ></iframe>
            </AspectRatio>
        </>
    );
};

export default PdfViewer;
