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
            <AspectRatio ratio={1 / 1.3}>
                <iframe className="h-full w-full " src={pdfUrl} style={{ zoom: '100%' }}></iframe>
            </AspectRatio>
        </div>
    );
};

export default PdfViewer;
