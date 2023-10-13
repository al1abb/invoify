import React from "react";
import { Button } from "@/components/ui/button";

type SendPdfEmailProps = {
    invoicePdf: Blob;
};

const SendPdfEmail = ({ invoicePdf }: SendPdfEmailProps) => {
    const url = window.URL.createObjectURL(invoicePdf);

    const downloadPdf = () => {
        // Create an anchor element to initiate the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <p>Here is your PDF</p>
            <iframe src={url}></iframe>
            <Button onClick={downloadPdf}>Download the PDF</Button>
        </>
    );
};

export default SendPdfEmail;
