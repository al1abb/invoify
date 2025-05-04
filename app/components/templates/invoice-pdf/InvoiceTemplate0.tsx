import { InvoiceLayout } from "@/app/components";
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
import { DATE_OPTIONS } from "@/lib/variables";
import { InvoiceType } from "@/types";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const logoUrl =
  "https://pub-b3e032943722420baddb7be6e251edb2.r2.dev/brand-vibe-logo.png";

const COMPANY_INFO = [
  {
    icon: <MapPin className="w-4 h-4 inline-block" />,
    text: "Al Qusais, Dubai, UAE",
  },
  {
    icon: <Mail className="w-4 h-4 inline-block" />,
    text: "contact@gobrandvibe.com",
  },
  {
    icon: <Phone className="w-4 h-4 inline-block" />,
    text: "+971 52 903 7007",
  },
  {
    icon: <Globe className="w-4 h-4 inline-block" />,
    text: "https://gobrandvibe.com",
  },
];

const DefaultTemplate = (data: InvoiceType) => {
  const { sender, receiver, details } = data;

  return (
    <InvoiceLayout data={data}>
      <div className="relative bg-gray-200 h-full">
        <div className="absolute w-full h-1/3 bg-black z-0" />

        <div className="relative z-10 p-6">
          {/* region: Logo */}
          <div className="flex items-center justify-between border-b-[0.5px] pb-4">
            <img
              src={logoUrl}
              width={140}
              height={80}
              alt={`Logo of ${sender.name}`}
              style={{ maxWidth: "140px", maxHeight: "80px" }}
            />

            <div>
              {COMPANY_INFO.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center text-white text-sm mt-2"
                >
                  {info.icon}
                  <p className="ml-2">{info.text}</p>
                </div>
              ))}
            </div>
          </div>

          <h1 className="text-white text-center text-2xl font-bold my-4">
            SALES INVOICE
          </h1>

          <div className="bg-white p-6 rounded-xl">
            <div className="flex justify-between gap-24">
              <div className="flex flex-col flex-1">
                <dl className="flex gap-3">
                  <dt className="min-w-[8rem] font-semibold text-gray-800">
                    Company name:
                  </dt>
                  <dd className="text-gray-500">{receiver.name}</dd>
                </dl>
                <dl className="flex gap-3">
                  <dt className="min-w-[8rem] font-semibold text-gray-800">
                    Phone number:
                  </dt>
                  <dd className="text-gray-500">{receiver.phone}</dd>
                </dl>
                <dl className="flex gap-3">
                  <dt className="min-w-[8rem] font-semibold text-gray-800">
                    Email:
                  </dt>
                  <dd className="text-gray-500">{receiver.email}</dd>
                </dl>
                <dl className="flex gap-3">
                  <dt className="min-w-[8rem] font-semibold text-gray-800">
                    Website:
                  </dt>
                  <dd className="col-span-3 text-gray-500">
                    {receiver.website}
                  </dd>
                </dl>
                <dl className="flex gap-3">
                  <dt className="min-w-[8rem] font-semibold text-gray-800">
                    Address:
                  </dt>
                  <dd className="text-gray-500">{receiver.address}</dd>
                </dl>
              </div>

              <div className="flex flex-col flex-1">
                <div className="ml-auto">
                  <dl className="flex gap-3 w-fit">
                    <dt className="min-w-[8rem] font-semibold text-gray-800">
                      Invoice date:
                    </dt>
                    <dd className="text-gray-500">
                      {new Date(details.invoiceDate).toLocaleDateString(
                        "en-US",
                        DATE_OPTIONS
                      )}
                    </dd>
                  </dl>
                  <dl className="flex gap-3 w-fit">
                    <dt className="min-w-[8rem] font-semibold text-gray-800">
                      Quotation no:
                    </dt>
                    <dd className="text-gray-500">{details.quotationNumber}</dd>
                  </dl>
                  <dl className="flex gap-3 w-fit">
                    <dt className="min-w-[8rem] font-semibold text-gray-800">
                      Invoice no:
                    </dt>
                    <dd className="text-gray-500">{details.invoiceNumber}</dd>
                  </dl>
                  <dl className="flex gap-3 w-fit">
                    <dt className="min-w-[8rem] font-semibold text-gray-800">
                      Sales person:
                    </dt>
                    <dd className="text-gray-500">{details.salesPerson}</dd>
                  </dl>
                  <dl className="flex gap-3 w-fit">
                    <dt className="min-w-[8rem] font-semibold text-gray-800">
                      Due date:
                    </dt>
                    <dd className="text-gray-500">
                      {new Date(details.dueDate).toLocaleDateString(
                        "en-US",
                        DATE_OPTIONS
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="border border-gray-200 rounded-lg space-y-1 overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-7 bg-yellow-400 items-center p-1">
                  <div className="text-center uppercase font-bold">Sr. no</div>
                  <div className="sm:col-span-3 uppercase font-bold">
                    Description
                  </div>
                  <div className="text-center uppercase font-bold">Qty</div>
                  <div className="text-center uppercase font-bold">
                    Unit price (AED)
                  </div>
                  <div className="text-center uppercase font-bold">
                    Amount (AED)
                  </div>
                </div>

                <div className="grid sm:grid-cols-7">
                  {details.items.map((item, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`text-center py-1 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        }`}
                      >
                        <p className="font-medium text-gray-800">{index + 1}</p>
                      </div>
                      <div
                        className={`sm:col-span-3 py-1 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        }`}
                      >
                        <p className="font-medium text-gray-800">{item.name}</p>
                      </div>
                      <div
                        className={`text-center py-1 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-gray-800">{item.quantity}</p>
                      </div>
                      <div
                        className={`text-center py-1 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-gray-800">
                          {formatNumberWithCommas(Number(item.unitPrice))}
                        </p>
                      </div>
                      <div
                        className={`text-center py-1 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-gray-800">
                          {formatNumberWithCommas(Number(item.total))}
                        </p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="sm:hidden border-b border-gray-200"></div>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-end">
              <div className="flex-1">
                {details.totalAmountInWords && (
                  <dl className="flex flex-col">
                    <dt className="font-semibold text-gray-800">
                      Grand Total in words:
                    </dt>
                    <dd>
                      <em>{details.totalAmountInWords}</em>
                    </dd>
                  </dl>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="w-fit ml-auto">
                  <dl className="flex gap-3 w-fit">
                    <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                      Subtotal:
                    </dt>
                    <dd>
                      {formatNumberWithCommas(Number(details.subTotal))}{" "}
                      {details.currency}
                    </dd>
                  </dl>
                  {details.discountDetails?.amount != undefined &&
                    details.discountDetails?.amount > 0 && (
                      <dl className="flex gap-3 w-fit">
                        <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                          Discount:
                        </dt>
                        <dd>
                          {details.discountDetails.amountType === "amount"
                            ? `- ${details.discountDetails.amount} ${details.currency}`
                            : `- ${details.discountDetails.amount}%`}
                        </dd>
                      </dl>
                    )}
                  {details.advancePaymentDetails?.amount != undefined &&
                    details.advancePaymentDetails?.amount > 0 && (
                      <dl className="flex gap-3 w-fit">
                        <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                          Advance payment:
                        </dt>
                        <dd>
                          {details.advancePaymentDetails.amountType === "amount"
                            ? `- ${details.advancePaymentDetails.amount} ${details.currency}`
                            : `- ${details.advancePaymentDetails.amount}%`}
                        </dd>
                      </dl>
                    )}
                  {details.taxDetails?.amount != undefined &&
                    details.taxDetails?.amount > 0 && (
                      <dl className="flex gap-3 w-fit">
                        <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                          VAT:
                        </dt>
                        <dd>
                          {details.taxDetails.amountType === "amount"
                            ? `+ ${details.taxDetails.amount} ${details.currency}`
                            : `+ ${details.taxDetails.amount}%`}
                        </dd>
                      </dl>
                    )}
                  {details.shippingDetails?.cost != undefined &&
                    details.shippingDetails?.cost > 0 && (
                      <dl className="flex gap-3 w-fit">
                        <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                          Shipping:
                        </dt>
                        <dd>
                          {details.shippingDetails.costType === "amount"
                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                            : `+ ${details.shippingDetails.cost}%`}
                        </dd>
                      </dl>
                    )}
                  <dl className="flex gap-3 w-fit">
                    <dt className="text-right min-w-[9rem] font-semibold text-gray-800">
                      Grand Total:
                    </dt>
                    <dd>
                      {formatNumberWithCommas(Number(details.totalAmount))}{" "}
                      {details.currency}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div>
              <div className="my-4">
                <div className="my-2">
                  <div className="text-sm flex gap-2">
                    <p className="font-bold min-w-[6rem]">Bank Name:</p>
                    <p>{details.paymentInformation?.bankName}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold min-w-[6rem]">Account Name:</p>
                    <p>{details.paymentInformation?.accountName}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold min-w-[6rem]">Account Class:</p>
                    <p>{details.paymentInformation?.accountClass}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold min-w-[6rem]">Account No:</p>
                    <p>{details.paymentInformation?.accountNumber}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold min-w-[6rem]">IBAN:</p>
                    <p>{details.paymentInformation?.iban}</p>
                  </div>
                </div>

                <div className="my-2">
                  <p className="font-semibold">Payment terms:</p>
                  <p className="font-regular text-gray-800">
                    {details.paymentTerms}
                  </p>
                </div>

                {details.additionalNotes ? (
                  <div className="my-2">
                    <p className="font-semibold">Additional notes:</p>
                    <p className="font-regular text-gray-800">
                      {details.additionalNotes}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Signature */}
            {details?.signature?.data && isDataUrl(details?.signature?.data) ? (
              <div className="mt-6">
                <p className="font-semibold text-gray-800">Signature:</p>
                <img
                  src={details.signature.data}
                  width={120}
                  height={60}
                  alt={`Signature of ${sender.name}`}
                />
              </div>
            ) : details.signature?.data ? (
              <div className="mt-6">
                <p className="text-gray-800">Signature:</p>
                <p
                  style={{
                    fontSize: 30,
                    fontWeight: 400,
                    fontFamily: `${details.signature.fontFamily}, cursive`,
                    color: "black",
                  }}
                >
                  {details.signature.data}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </InvoiceLayout>
  );
};

export default DefaultTemplate;
