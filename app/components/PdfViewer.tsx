import { Document, Page, pdfjs } from "react-pdf";

// Shadcn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PdfViewerProps {
    pdfData: Blob;
}
const PdfViewer = ({ pdfData }: PdfViewerProps) => {
    const pdfUrl = window.URL.createObjectURL(pdfData)
    return (
        <AspectRatio ratio={1 / 1}>
            <iframe className="w-full h-full" src={pdfUrl} style={{ zoom: '100%' }}></iframe>
        </AspectRatio>
    );
};

export default PdfViewer;
