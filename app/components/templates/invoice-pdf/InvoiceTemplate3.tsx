    import React from "react";

    // Components
    import { InvoiceLayout } from "@/app/components";

    // Helpers
    import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
    // Variables
    import { DATE_OPTIONS } from "@/lib/variables";

    // Types
    import { InvoiceType } from "@/types";

    const Row = ({ children }: { children: React.ReactNode }) => (
        <div className="grid grid-cols-2 border-b border-black/70 text-[11px]">
            {children}
        </div>
    );

    const Cell = ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => (
        <div className={"border-l border-black/70 p-1 leading-snug " + (className || "")}>{children}</div>
    );

    const InvoiceTemplate3 = (data: InvoiceType) => {
        const { sender, receiver, details } = data;

        const formatDate = (value: string | Date) =>
            new Date(value).toLocaleDateString("en-US", DATE_OPTIONS);

        const qtyTotal = details.items.reduce((acc, it) => acc + Number(it.quantity || 0), 0);

        // With running headers, we don't need manual pagination
        // The browser will handle page breaks automatically

        const Header = () => (
            <>
                {/* Title row */}
                <tr className="avoid-break">
                    <td colSpan={6} className="p-0">
                        <h1 className="text-center text-xl font-semibold tracking-wide">Tax Invoice</h1>
                    </td>
                </tr>

                {/* Top header: Seller + Invoice meta */}
                <tr className="avoid-break">
                    <td colSpan={6} className="p-0">
                        <div className="mt-2 grid grid-cols-2 border border-black/70">
                            {/* Seller */}
                            <div className="p-2 text-left border-r border-black/70 text-[12px]">
                                <p className="font-semibold text-[14px]">{sender.name}</p>
                                <p>{sender.address}</p>
                                <p>
                                    {sender.zipCode}, {sender.city}
                                </p>
                                <p>{sender.country}</p>
                                <div className="mt-1 text-[11px] space-y-0.5">
                                    <p>Email: {sender.email}</p>
                                    <p>Phone: {sender.phone}</p>
                                </div>
                            </div>

                            {/* Invoice / Dispatch details */}
                            <div className="text-[11px] text-left">
                                <Row>
                                    <Cell className="border-l-0">Invoice No.</Cell>
                                    <Cell>{details.invoiceNumber}</Cell>
                                </Row>
                                <Row>
                                    <Cell className="border-l-0">Dated</Cell>
                                    <Cell>{formatDate(details.invoiceDate)}</Cell>
                                </Row>
                                <Row>
                                    <Cell className="border-l-0">Delivery Note</Cell>
                                    <Cell>{details.purchaseOrderNumber || ""}</Cell>
                                </Row>
                                <Row>
                                    <Cell className="border-l-0">Mode/Terms of Payment</Cell>
                                    <Cell>{details.paymentTerms}</Cell>
                                </Row>
                                <Row>
                                    <Cell className="border-l-0">Reference No. & Date</Cell>
                                    <Cell>{details.updatedAt || ""}</Cell>
                                </Row>
                                <Row>
                                    <Cell className="border-l-0">Other References</Cell>
                                    <Cell>{""}</Cell>
                                </Row>
                            </div>
                        </div>
                    </td>
                </tr>

                {/* Consignee / Buyer */}
                <tr className="avoid-break">
                    <td colSpan={6} className="p-0">
                        <div className="grid grid-cols-2 border border-t-0 text-left border-black/70">
                            {/* Consignee */}
                            <div className="p-2 border-r border-black/70">
                                <p className="text-[11px]">Consignee (Ship to)</p>
                                <p className="font-semibold text-[13px]">{receiver.name}</p>
                                <p className="text-[12px]">{receiver.address}</p>
                                <p className="text-[12px]">
                                    {receiver.zipCode}, {receiver.city}
                                </p>
                                <p className="text-[12px]">{receiver.country}</p>
                            </div>
                            {/* Buyer */}
                            <div className="p-2">
                                <p className="text-[11px]">Buyer (Bill to)</p>
                                <p className="font-semibold text-[13px]">{receiver.name}</p>
                                <p className="text-[12px]">{receiver.address}</p>
                                <p className="text-[12px]">
                                    {receiver.zipCode}, {receiver.city}
                                </p>
                                <p className="text-[12px]">{receiver.country}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </>
        );

        const ItemsTableHeader = () => (
            <tr className="text-[11px] font-semibold text-center border border-black/70">
                <th className="p-1 border-r border-black/70 w-[40px]">Sl No</th>
                <th className="p-1 border-r border-black/70 text-left">Description of Goods</th>
                <th className="p-1 border-r border-black/70 w-[100px]">Quantity</th>
                <th className="p-1 border-r border-black/70 w-[80px]">Rate</th>
                <th className="p-1 border-r border-black/70 w-[60px]">per</th>
                <th className="p-1 w-[100px]">Amount</th>
            </tr>
        );

        return (
            <InvoiceLayout data={data}>
            <style>{`
                /* Basic page break styles - main CSS is in generatePdfService.ts */
                tr { break-inside: avoid; }

                /* Ensure table content fits within row blocks */
                table.invoice-table { table-layout: fixed; width: 100%; }
                table.invoice-table td, table.invoice-table th { word-break: break-word; overflow-wrap: anywhere; }
                td.desc-cell, th.desc-cell { white-space: pre-wrap; hyphens: auto; }

                /* Prevent page breaks within key blocks */
                .avoid-break { 
                    break-inside: avoid; 
                    page-break-inside: avoid; 
                    -webkit-column-break-inside: avoid;
                    -moz-column-break-inside: avoid;
                }

                /* Table structure for repeating headers - now using native HTML table */
                @media print {
                    thead {
                        display: table-header-group !important;
                    }
                    
                    tbody {
                        display: table-row-group !important;
                    }
                    
                    tfoot {
                        display: table-footer-group !important;
                    }
                    
                    /* Ensure header rows don't break across pages */
                    .avoid-break {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    /* Ensure table cells don't break across pages */
                    thead th, tbody td, tfoot td {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>

                <div className="text-gray-900 dark:text-black">
                <table className="invoice-table w-full border-collapse">
                    <colgroup>
                        <col style={{ width: "40px" }} />
                        <col />
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "80px" }} />
                        <col style={{ width: "60px" }} />
                        <col style={{ width: "100px" }} />
                    </colgroup>
                    <thead>
                        <Header />
                        <ItemsTableHeader />
                    </thead>
                    <tbody className="table-row-group"> 
                        {/* Items table rows */}
                        {details.items.map((item, idx) => (
                            <tr key={idx} className="text-[11px] border border-black/50 align-top">
                                <td className="p-1 border-r border-black/20 text-center align-top">{idx + 1}</td>
                                <td className="p-1 border-r border-black/20 desc-cell">
                                    <p className="font-medium">{item.name}</p>
                                {item.description && (
                                    <p className="opacity-80 dark:opacity-90 dark:text-black">{item.description}</p>
                                )}
                                </td>
                                <td className="p-1 border-r border-black/20 text-right align-top">{item.quantity}</td>
                                <td className="p-1 border-r border-black/20 text-right align-top">{formatNumberWithCommas(Number(item.unitPrice))}</td>
                                <td className="p-1 border-r border-black/20 text-center align-top">Nos</td>
                                <td className="p-1 text-right align-top">{formatNumberWithCommas(Number(item.total))}</td>
                            </tr>
                        ))}

                        {/* Totals row */}
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="grid grid-cols-12 text-[11px] font-semibold">
                                    <div className="col-span-6 p-1 border-l border-b border-black/70 text-right">Total</div>
                                    <div className="col-span-3 p-1 border-l border-b border-black/70 text-right">{qtyTotal} Nos</div>
                                    <div className="col-span-3 p-1 border-l border-b border-r border-black/70 text-right">{formatNumberWithCommas(Number(details.subTotal))}</div>
                                </div>
                            </td>
                        </tr>

                        {/* Charges summary: subtotal, discount, tax, shipping, total */}
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="avoid-break border border-black/70">
                                    <div className="grid grid-cols-12 text-[11px]">
                                        <div className="col-span-7 p-1 border-r border-black/70"></div>
                                        <div className="col-span-5 p-1">
                                            <div className="grid grid-cols-2 gap-y-1">
                                                <div className="text-right font-semibold pr-2">Subtotal:</div>
                                                <div className="text-right">{formatNumberWithCommas(Number(details.subTotal))}</div>

                                                {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                                                    <>
                                                        <div className="text-right font-semibold pr-2">Discount:</div>
                                                        <div className="text-right">
                                                            {details.discountDetails.amountType === "amount"
                                                                ? `- ${formatNumberWithCommas(Number(details.discountDetails.amount))}`
                                                                : `- ${details.discountDetails.amount}%`}
                                                        </div>
                                                    </>
                                                )}

                                                {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
                                                    <>
                                                        <div className="text-right font-semibold pr-2">Tax:</div>
                                                        <div className="text-right">
                                                            {details.taxDetails.amountType === "amount"
                                                                ? `+ ${formatNumberWithCommas(Number(details.taxDetails.amount))}`
                                                                : `+ ${details.taxDetails.amount}%`}
                                                        </div>
                                                    </>
                                                )}

                                                {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
                                                    <>
                                                        <div className="text-right font-semibold pr-2">Shipping:</div>
                                                        <div className="text-right">
                                                            {details.shippingDetails.costType === "amount"
                                                                ? `+ ${formatNumberWithCommas(Number(details.shippingDetails.cost))}`
                                                                : `+ ${details.shippingDetails.cost}%`}
                                                        </div>
                                                    </>
                                                )}

                                                <div className="text-right font-semibold pr-2">Total:</div>
                                                <div className="text-right">{formatNumberWithCommas(Number(details.totalAmount))} {details.currency}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Amount in words + statement table */}
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="avoid-break grid grid-cols-2 border border-t-0 border-black/70">
                                    <div className="p-2 text-[11px] border-r border-black/70">
                                        <p className="font-semibold">Amount Chargeable (in words):</p>
                                        <p className="mt-1 dark:text-black-200">{details.totalAmountInWords}</p>
                                    </div>
                                    <div className="p-2 text-[11px]">
                                        <div className="border border-black/70">
                                            <div className="grid grid-cols-4 text-center text-[10px] font-semibold border-b border-black/70">
                                                <div className="p-1 border-r border-black/70">Bill Date</div>
                                                <div className="p-1 border-r border-black/70">Bill No</div>
                                                <div className="p-1 border-r border-black/70">Bill Amt</div>
                                                <div className="p-1">Outstand. Amt</div>
                                            </div>
                                            {/* Single current row */}
                                            <div className="grid grid-cols-4 text-center text-[11px]">
                                                <div className="p-1 border-r border-black/20">{formatDate(details.invoiceDate)}</div>
                                                <div className="p-1 border-r border-black/20">{details.invoiceNumber}</div>
                                                <div className="p-1 border-r border-black/20">{formatNumberWithCommas(Number(details.totalAmount))}</div>
                                                <div className="p-1">0.00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Declaration + signature block */}
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="avoid-break grid grid-cols-2 border border-t-0 border-black/70">
                                    <div className="p-2 text-[10px]">
                                        <p className="font-semibold">Declaration</p>
                                        <p>
                                            We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                        </p>
                                    </div>
                                    <div className="p-2 text-right text-[11px]">
                                        <p className="font-semibold">For {sender.name}</p>
                                        {details?.signature?.data && isDataUrl(details?.signature?.data) ? (
                                            <div className="mt-2 inline-block">
                                                <img
                                                    src={details.signature.data}
                                                    width={120}
                                                    height={60}
                                                    alt={`Signature of ${sender.name}`}
                                                />
                                            </div>
                                        ) : details.signature?.data ? (
                                            <p
                                                className="mt-4"
                                                style={{
                                                    fontSize: 24,
                                                    fontWeight: 400,
                                                    fontFamily: `${details.signature.fontFamily}, cursive`,
                                                    color: "black",
                                                }}
                                            >
                                                {details.signature.data}
                                            </p>
                                        ) : (
                                            <div className="h-10" />
                                        )}
                                        <p className="mt-6">Authorized Signatory</p>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Bottom totals area */}
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="avoid-break mt-1 grid grid-cols-2 gap-2">
                                    <div className="text-[10px] text-center text-gray-600 dark:text-black">This is a Computer Generated Invoice</div>
                                    <div className="text-right text-[12px] font-semibold">Total: {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </InvoiceLayout>
        );
    };

    export default InvoiceTemplate3;


