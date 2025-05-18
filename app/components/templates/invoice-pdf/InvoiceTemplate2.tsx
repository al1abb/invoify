import React from "react";
import Image from "next/image";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate2 = (data: InvoiceType) => {
    const { sender, receiver, details } = data;
    return (
        <InvoiceLayout data={data}>
            <div className="flex justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        Invoice #
                    </h2>
                    <span className="mt-1 block text-gray-500">
                        {details.invoiceNumber}
                    </span>
                    {details.invoiceLogo && (
                        <Image
                            src={details.invoiceLogo}
                            width={140}
                            height={100}
                            alt={`Logo of ${sender.name}`}
                        />
                    )}

                    <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
                        {sender.name}
                    </h1>
                </div>
                <div className="text-right">
                    <address className="mt-4 not-italic text-gray-800">
                        {sender.address}
                        <br />
                        {sender.zipCode}, {sender.city}
                        <br />
                        {sender.country}
                        <br />
                    </address>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
                    {/* Propriétaire (Émetteur) */}
                    <div className="text-left bg-gray-900 text-white p-4 rounded-md w-full sm:w-1/2">
                        <div className="font-bold text-base mb-1">
                            FACTURE N°. {details.invoiceNumber}
                        </div>
                        <div className="text-xs mb-2">
                            Date :{" "}
                            {new Date(
                                details.invoiceDate
                            ).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-xs mb-2">
                            Référence : {details.invoiceNumber}
                        </div>
                        <div className="text-xs mb-2">Émis par : {sender.name}</div>
                        <div className="text-xs mb-2">{sender.address}</div>
                        <div className="text-xs mb-2">
                            {sender.zipCode}, {sender.city}
                        </div>
                        <div className="text-xs mb-2">{sender.country}</div>
                        {sender.email && (
                            <div className="text-xs mb-2">
                                Email : {sender.email}
                            </div>
                        )}
                        {sender.phone && (
                            <div className="text-xs mb-2">
                                Contact : {sender.phone}
                            </div>
                        )}
                    </div>
                    {/* Destinataire */}
                    <div className="text-right bg-gray-900 text-white p-4 rounded-md w-full sm:w-1/2">
                        <div className="font-bold text-base mb-1">
                            {(receiver.name || '').toUpperCase()}
                        </div>
                        <div className="font-bold text-xs mb-1 underline">
                            DESTINATAIRE
                        </div>
                        <div className="text-xs mb-2">{receiver.address || ''}</div>
                        <div className="text-xs mb-2">
                            {receiver.zipCode || ''}, {receiver.city || ''}
                        </div>
                        <div className="text-xs mb-2">{receiver.country || ''}</div>
                        {receiver.email && (
                            <div className="text-xs mb-2">
                                Email : {receiver.email}
                            </div>
                        )}
                        {receiver.phone && (
                            <div className="text-xs mb-2">
                                Tél : {receiver.phone}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="border border-gray-200 p-1 rounded-lg space-y-1">
                    <div className="hidden sm:grid sm:grid-cols-5">
                        <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
                            Item
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Qty
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Rate
                        </div>
                        <div className="text-right text-xs font-medium text-gray-500 uppercase">
                            Amount
                        </div>
                    </div>
                    <div className="hidden sm:block border-b border-gray-200"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-1">
                        {details.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="col-span-full sm:col-span-2 border-b border-gray-300">
                                    <p className="font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-600 whitespace-pre-line">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.quantity}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.unitPrice} {details.currency}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="sm:text-right text-gray-800">
                                        {item.total} {details.currency}
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="sm:hidden border-b border-gray-200"></div>
                </div>
            </div>

            <div className="mt-2 flex sm:justify-end">
                <div className="w-full max-w-2xl sm:text-right space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                Subtotal:
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.subTotal)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.discountDetails?.amount != undefined &&
                            details.discountDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Discount:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.discountDetails.amountType ===
                                        "amount"
                                            ? `- ${details.discountDetails.amount} ${details.currency}`
                                            : `- ${details.discountDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.taxDetails?.amount != undefined &&
                            details.taxDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Tax:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.taxDetails.amountType ===
                                        "amount"
                                            ? `+ ${details.taxDetails.amount} ${details.currency}`
                                            : `+ ${details.taxDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.shippingDetails?.cost != undefined &&
                            details.shippingDetails?.cost > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Shipping:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.shippingDetails.costType ===
                                        "amount"
                                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                            : `+ ${details.shippingDetails.cost}%`}
                                    </dd>
                                </dl>
                            )}
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                Total:
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.totalAmount)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.totalAmountInWords && (
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    Total in words:
                                </dt>
                                <dd className="col-span-2 text-gray-500">
                                    <em>
                                        {details.totalAmountInWords}{" "}
                                        {details.currency}
                                    </em>
                                </dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="my-4">
                    <div className="my-2">
                        <p className="font-semibold text-blue-600">
                            Additional notes:
                        </p>
                        <p className="font-regular text-gray-800">
                            {details.additionalNotes}
                        </p>
                    </div>
                    <div className="my-2">
                        <p className="font-semibold text-blue-600">
                            Payment terms:
                        </p>
                        <p className="font-regular text-gray-800">
                            {details.paymentTerms}
                        </p>
                    </div>
                    <div className="my-2">
                        <span className="font-semibold text-md text-gray-800">
                            Please send the payment to this address
                            <p className="text-sm">
                                Bank: {details.paymentInformation?.bankName}
                            </p>
                            <p className="text-sm">
                                Account name:{" "}
                                {details.paymentInformation?.accountName}
                            </p>
                            <p className="text-sm">
                                Account no:{" "}
                                {details.paymentInformation?.accountNumber}
                            </p>
                        </span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm">
                    If you have any questions concerning this invoice, use the
                    following contact information:
                </p>
                <div>
                    <p className="block text-sm font-medium text-gray-800">
                        {sender.email}
                    </p>
                    <p className="block text-sm font-medium text-gray-800">
                        {sender.phone}
                    </p>
                </div>
            </div>

            {/* Signature */}
            {details?.signature && details.signature.data && isDataUrl(details.signature.data) ? (
                <div className="mt-6 flex justify-end">
                    <div className="text-right">
                        <p className="font-semibold text-gray-800">Signature:</p>
                        <Image
                            src={details.signature.data}
                            width={120}
                            height={60}
                            alt={`Signature of ${sender.name}`}
                        />
                    </div>
                </div>
            ) : details?.signature && details.signature.data ? (
                <div className="mt-6 flex justify-end">
                    <div className="text-right">
                        <p className="text-gray-800">Signature:</p>
                        <p
                            style={{
                                fontSize: 30,
                                fontWeight: 400,
                                fontFamily: `${details.signature.fontFamily || 'cursive'}, cursive`,
                                color: "black",
                            }}
                        >
                            {details.signature.data}
                        </p>
                    </div>
                </div>
            ) : null}
        </InvoiceLayout>
    );
};

export default InvoiceTemplate2;
