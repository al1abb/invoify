// Shadcn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

type PdfViewerProps = {
    pdfBlob: Blob;
};

const PdfViewer = ({ pdfBlob }: PdfViewerProps) => {
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    return (
        <AspectRatio ratio={1 / 1}>
            <iframe
                className="w-full h-full"
                src={`${pdfUrl}#toolbar=0&view=FitB`}
            ></iframe>
        </AspectRatio>
    );
};

export default PdfViewer;
