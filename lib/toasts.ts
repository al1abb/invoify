import { toast } from "@/components/ui/use-toast";

function pdfGenerationSuccess() {
    toast({
        variant: "default",
        title: "Your invoice has been generated!",
        description: "You can preview, download, or save it",
    });
}
function saveInvoiceSuccess() {
    toast({
        variant: "default",
        title: "Saved Invoice",
        description: "Your invoice details are saved now",
    });
}

function modifiedInvoiceSuccess() {
    toast({
        variant: "default",
        title: "Modified Invoice",
        description: "Successfully modified your invoice",
    });
}

export { pdfGenerationSuccess, saveInvoiceSuccess, modifiedInvoiceSuccess };
