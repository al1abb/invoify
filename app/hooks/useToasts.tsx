import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

const useToasts = () => {
    type GenerationSuccessType = {
        previewPdfInTab?: () => void;
        downloadPdf?: () => void;
    };

    type SendErrorType = {
        email: string;
        sendPdfToMail: (email: string) => void;
    };

    const pdfGenerationSuccess = ({
        previewPdfInTab,
        downloadPdf,
    }: GenerationSuccessType) => {
        toast({
            variant: "default",
            title: "Your invoice has been generated!",
            description: "You can preview, download, or save it",
            action: (
                <div className="">
                    <ToastAction onClick={previewPdfInTab} altText="Preview">
                        <p>Preview</p>
                    </ToastAction>
                    <ToastAction onClick={downloadPdf} altText="Download">
                        <p>Download</p>
                    </ToastAction>
                </div>
            ),
        });
    };

    const saveInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "Saved Invoice",
            description: "Your invoice details are saved now",
        });
    };

    const modifiedInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "Modified Invoice",
            description: "Successfully modified your invoice",
        });
    };

    const sendPdfSuccess = () => {
        toast({
            variant: "default",
            title: "Email sent",
            description: "Your invoice has been sent to the specified email",
        });
    };

    const sendPdfError = ({ email, sendPdfToMail }: SendErrorType) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong. Try again in a moment",
            action: (
                <ToastAction
                    onClick={() => sendPdfToMail(email)}
                    altText="Try again"
                >
                    Try again
                </ToastAction>
            ),
        });
    };

    return {
        pdfGenerationSuccess,
        saveInvoiceSuccess,
        modifiedInvoiceSuccess,
        sendPdfSuccess,
        sendPdfError,
    };
};

export default useToasts;
