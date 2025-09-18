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

    // Pagination: chunk items by rows per page (approximation suited for A4 height in our layout)
    const rowsPerPage = 16;
    const pages: typeof details.items[] = [];
    for (let i = 0; i < details.items.length; i += rowsPerPage) {
        pages.push(details.items.slice(i, i + rowsPerPage));
    }

    const Header = () => (
        <>
            {/* Title */}
            <h1 className="text-center text-xl font-semibold tracking-wide">Tax Invoice</h1>

            {/* Top header: Seller + Invoice meta */}
            <div className="mt-2 grid grid-cols-2 border border-black/70">
                {/* Seller */}
                <div className="p-2 border-r border-black/70 text-[12px]">
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
                <div className="text-[11px]">
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

            {/* Consignee / Buyer */}
            <div className="grid grid-cols-2 border border-t-0 border-black/70">
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
        </>
    );

    const ItemsTableHeader = () => (
        <div className="grid grid-cols-12 text-[11px] font-semibold text-center border-b border-black/70">
            <div className="col-span-1 p-1 border-r border-black/70">Sl No</div>
            <div className="col-span-6 p-1 border-r border-black/70">Description of Goods</div>
            <div className="col-span-2 p-1 border-r border-black/70">Quantity</div>
            <div className="col-span-1 p-1 border-r border-black/70">Rate</div>
            <div className="col-span-1 p-1 border-r border-black/70">per</div>
            <div className="col-span-1 p-1">Amount</div>
        </div>
    );

    return (
        <InvoiceLayout data={data}>
            <style>{`
                @media print {
                    .no-break { break-inside: avoid; page-break-inside: avoid; }
                    .page-split { break-after: page; page-break-after: always; }
                    .summary-break { break-before: page; page-break-before: always; }
                }
                .no-break { break-inside: avoid; }
            `}</style>
            {pages.map((chunk, pageIndex) => {
                const isLast = pageIndex === pages.length - 1;
                const globalOffset = pageIndex * rowsPerPage;
                return (
                    <div key={pageIndex} className={isLast ? "" : "page-split"}>
                        <Header />

                        {/* Goods table */}
                        <div className="border border-t-0 border-black/70">
                            <ItemsTableHeader />

                            {chunk.map((item, idx) => (
                                <div key={idx} className="no-break grid grid-cols-12 text-[11px] border-b border-black/50">
                                    <div className="col-span-1 p-1 border-r border-black/20 text-center">{globalOffset + idx + 1}</div>
                                    <div className="col-span-6 p-1 border-r border-black/20">
                                        <p className="font-medium">{item.name}</p>
                                        {item.description && (
                                            <p className="opacity-80 whitespace-pre-line">{item.description}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2 p-1 border-r border-black/20 text-right">
                                        {item.quantity}
                                    </div>
                                    <div className="col-span-1 p-1 border-r border-black/20 text-right">
                                        {formatNumberWithCommas(Number(item.unitPrice))}
                                    </div>
                                    <div className="col-span-1 p-1 border-r border-black/20 text-center">Nos</div>
                                    <div className="col-span-1 p-1 text-right">
                                        {formatNumberWithCommas(Number(item.total))}
                                    </div>
                                </div>
                            ))}

                            {/* Footer total row only on last page */}
                            {isLast && (
                                <div className="grid grid-cols-12 text-[11px] font-semibold">
                                    <div className="col-span-7 p-1 border-r border-black/70 text-right">Total</div>
                                    <div className="col-span-2 p-1 border-r border-black/70 text-right">{qtyTotal} Nos</div>
                                    <div className="col-span-2 p-1 border-r border-black/70" />
                                    <div className="col-span-1 p-1 text-right">
                                        {formatNumberWithCommas(Number(details.subTotal))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Final summary blocks only on last page */}
                        {isLast && (
                            <>
                                {/* Charges summary: subtotal, discount, tax, shipping, total */}
                                <div className="summary-break border border-t-0 border-black/70">
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

                                {/* Amount in words + statement table */}
                                <div className="grid grid-cols-2 border border-t-0 border-black/70">
                                    <div className="p-2 text-[11px] border-r border-black/70">
                                        <p className="font-semibold">Amount Chargeable (in words):</p>
                                        <p className="mt-1">{details.totalAmountInWords}</p>
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

                                {/* Declaration + signature block */}
                                <div className="grid grid-cols-2 border border-t-0 border-black/70">
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

                                {/* Bottom totals area */}
                                <div className="mt-1 grid grid-cols-2 gap-2">
                                    <div className="text-[10px] text-center text-gray-600">This is a Computer Generated Invoice</div>
                                    <div className="text-right text-[12px] font-semibold">Total: {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}</div>
                                </div>
                            </>
                        )}

                        {/* Watermark on every page */}
                        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-10">
                            <div className="text-center">
                                <p className="uppercase text-xs tracking-wide">Tally Add-On Developed By</p>
                                <p className="text-5xl font-bold">elogics</p>
                                <p className="tracking-widest">CORPORATION</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </InvoiceLayout>
    );
};

export default InvoiceTemplate3;


