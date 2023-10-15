import { toast } from "@/components/ui/use-toast";

const pdfGenerationSuccess = () => {
    toast({
        variant: "default",
        title: "Your invoice has been generated!",
        description: "You can preview, download, or save it",
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

const sendPdfError = () => {
    toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Try again in a moment",
    });
};

export {
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
};
