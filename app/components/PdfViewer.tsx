import { Document, Page, pdfjs } from "react-pdf";

// Shadcn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PdfViewerProps {
    pdfData: Blob;
}
const PdfViewer = ({ pdfData }: PdfViewerProps) => {
    const pdfUrl = window.URL.createObjectURL(pdfData)
    return (
        <div className="w-full">
            <AspectRatio ratio={1 / 1.4}>
                <iframe className="w-full h-full" src={pdfUrl}></iframe>
            </AspectRatio>
        </div>
    );
};

export default PdfViewer;
