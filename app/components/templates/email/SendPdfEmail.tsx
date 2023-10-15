import React from "react";

const SendPdfEmail = async () => {
    const ReactDOMServer = (await import("react-dom/server")).default;

    const content = (
        <>
            <p>Thanks for using Invoify. Here is your PDF invoice</p>
        </>
    );

    const htmlContent = ReactDOMServer.renderToStaticMarkup(content);
    return htmlContent;
};

export default SendPdfEmail;
