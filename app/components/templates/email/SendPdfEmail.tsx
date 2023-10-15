import React from "react";

type SendPdfEmailProps = Blob;

const SendPdfEmail = async (invoicePdf: SendPdfEmailProps) => {
    const ReactDOMServer = (await import("react-dom/server")).default;
    // const url = URL.createObjectURL(invoicePdf);
    console.log("Email template variable:", invoicePdf);

    const content = (
        <>
            <p>Here is your PDF</p>
            {/* <iframe src={invoicePdf}></iframe>
            <a href={invoicePdf} download="invoice.pdf">
                Download PDF
            </a> */}
        </>
    );

    const htmlContent = ReactDOMServer.renderToStaticMarkup(content);
    return htmlContent;
};

export default SendPdfEmail;
