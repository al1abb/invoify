import { toast } from "@/components/ui/use-toast";

function pdfGenerationSuccess() {
    toast({
        variant: "default",
        title: "Your invoice has been generated!",
        description: "You can preview or download it below.",
    });
}

export { pdfGenerationSuccess };
