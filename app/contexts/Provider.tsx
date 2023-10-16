import React from "react";
import { InvoiceContextProvider } from "./InvoiceContext";

type ProviderProps = {
    children: React.ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
    // return (<InvoiceContextProvider>{children}</InvoiceContextProvider>);
};

export default Provider;
