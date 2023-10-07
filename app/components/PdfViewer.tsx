// Shadcn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

type PdfViewerProps = {
    pdfUrl: string;
}

const PdfViewer = ({ pdfUrl }: PdfViewerProps) => {    
    return (
        <AspectRatio ratio={1 / 1}>
            <iframe className="w-full h-full" src={`${pdfUrl}#toolbar=0&view=FitB&navpanes=0`}></iframe>
        </AspectRatio>
    );
};

export default PdfViewer;
