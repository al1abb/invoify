import { toast } from "sonner";

const useToasts = () => {
  type SendErrorType = {
    email: string;
    sendPdfToMail: (email: string) => void;
  };

  const newInvoiceSuccess = () => {
    toast.success("Generated new invoice", {
      description: "Successfully created a new invoice",
    });
  };

  const pdfGenerationSuccess = () => {
    toast.success("Your invoice has been generated!", {
      description: "You can preview, download, or save it from the actions tab",
    });
  };

  const saveInvoiceSuccess = () => {
    toast.success("Saved Invoice", {
      description: "Your invoice details are saved now",
    });
  };

  const modifiedInvoiceSuccess = () => {
    toast.success("Modified Invoice", {
      description: "Successfully modified your invoice",
    });
  };

  const sendPdfSuccess = () => {
    toast.success("Email sent", {
      description: "Your invoice has been sent to the specified email",
    });
  };

  const sendPdfError = ({ email, sendPdfToMail }: SendErrorType) => {
    toast.error("Error", {
      description: "Something went wrong. Try again in a moment",
      action: {
        label: "Try again",
        onClick: () => sendPdfToMail(email),
      },
    });
  };

  const importInvoiceError = () => {
    toast.error("Error", {
      description:
        "Something went importing the invoice. Make sure the file is a valid Invoify JSON export",
    });
  };

  return {
    newInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
    importInvoiceError,
  };
};

export default useToasts;
