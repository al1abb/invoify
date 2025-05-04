import { InvoiceLayout } from "@/app/components";
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
import { DATE_OPTIONS } from "@/lib/variables";
import { InvoiceTypeWithPreview } from "@/types";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

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

const DefaultTemplate = (props: InvoiceTypeWithPreview) => {
  const { sender, receiver, details, isPreview = false } = props;

  // Classes that will only be applied in preview mode
  const previewClasses = {
    container: isPreview ? "@container" : "",
    logoMaxWidth: isPreview ? "@sm:max-w-[100px]" : "",
    companyInfoText: isPreview ? "@sm:text-xs" : "",
    companyInfoMargin: isPreview ? "@sm:mt-1" : "",
    titleSize: isPreview ? "@sm:text-xl" : "",
    titleMargin: isPreview ? "@sm:my-2" : "",
    padding: isPreview ? "@sm:p-4" : "",
    flexRow: isPreview ? "@md:flex-row" : "sm:flex-row",
    gap: isPreview ? "@sm:gap-2" : "",
    textSize: isPreview ? "@sm:text-sm" : "",
    justifyBetween: isPreview ? "@md:justify-between" : "sm:justify-between",
    marginLeft: isPreview ? "@md:ml-auto" : "sm:ml-auto",
    marginBottom: isPreview ? "@md:mb-0" : "sm:mb-0",
    flexCol: isPreview ? "@md:flex-row" : "sm:flex-row",
    colSpan: isPreview ? "@md:col-span-3" : "sm:col-span-3",
    gap8: isPreview ? "@md:gap-8" : "sm:gap-8",
  };

  // Classes and styles optimized for both preview and PDF modes
  const styles = {
    // Font sizes
    fontSize: isPreview
      ? {
          xs: "text-[9px]", // Smaller
          sm: "text-[10px]", // Smaller for top section
          base: "text-xs", // Smaller
          lg: "text-sm", // Smaller
          xl: "text-base", // Smaller
        }
      : {
          xs: "text-xs",
          sm: "text-sm",
          base: "text-base",
          lg: "text-lg",
          xl: "text-xl",
        },
    // Paddings and margins
    spacing: isPreview
      ? {
          p: "p-2",
          px: "px-2",
          py: "py-1",
          m: "m-1",
          mb: "mb-0.5", // Reduced
          mt: "mt-0.5", // Reduced
          gap: "gap-0.5", // Reduced
        }
      : {
          // ...existing code...
        },
    // ...existing code...
  };

  return (
    <InvoiceLayout data={props}>
      <div
        className={`relative bg-gray-200 h-full ${previewClasses.container} ${isPreview ? "text-xs" : ""}`}
      >
        <div className="absolute w-full h-1/3 bg-black z-0" />

        <div className="relative z-10 p-6">
          {/* region: Logo */}
          <div
            className={`flex flex-col ${previewClasses.flexRow} items-center ${previewClasses.justifyBetween} border-b-[0.5px] pb-4`}
          >
            <img
              src={logoUrl}
              width={140}
              height={80}
              alt={`Logo of ${sender.name}`}
              style={{ maxWidth: "140px", maxHeight: "80px" }}
              className={`mb-4 ${previewClasses.marginBottom} ${previewClasses.logoMaxWidth}`}
            />

            <div>
              {COMPANY_INFO.map((info, index) => (
                <div
                  key={index}
                  className={`flex items-center text-white ${previewClasses.companyInfoText} text-sm mt-2 ${previewClasses.companyInfoMargin}`}
                >
                  {info.icon}
                  <p className="ml-2">{info.text}</p>
                </div>
              ))}
            </div>
          </div>

          <h1
            className={`text-white text-center ${previewClasses.titleSize} text-2xl font-bold my-4 ${previewClasses.titleMargin}`}
          >
            SALES INVOICE
          </h1>

          <div className={`bg-white p-6 ${previewClasses.padding} rounded-xl`}>
            {/* Modified table layout with adjusted spacing and column widths */}
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top w-[40%]">
                    {/* Customer Info - Left Column */}
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Company name:
                          </td>
                          <td>{receiver.name}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Phone number:
                          </td>
                          <td>{receiver.phone}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Email:
                          </td>
                          <td>{receiver.email}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Website:
                          </td>
                          <td>{receiver.website}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Address:
                          </td>
                          <td>{receiver.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td className="align-top w-[10%]">
                    {/* Smaller spacer column */}
                  </td>

                  <td className="align-top w-[50%]">
                    {/* Invoice Info - Right Column - moved closer to the edge */}
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Invoice date:
                          </td>
                          <td>
                            {new Date(details.invoiceDate).toLocaleDateString(
                              "en-US",
                              DATE_OPTIONS
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Quotation no:
                          </td>
                          <td>{details.quotationNumber}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Invoice no:
                          </td>
                          <td>{details.invoiceNumber}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Sales person:
                          </td>
                          <td>{details.salesPerson}</td>
                        </tr>
                        <tr>
                          <td
                            style={{ width: isPreview ? "100px" : "130px", paddingRight: "8px" }}
                            className="font-semibold align-top whitespace-nowrap"
                          >
                            Due date:
                          </td>
                          <td>
                            {new Date(details.dueDate).toLocaleDateString(
                              "en-US",
                              DATE_OPTIONS
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Desktop header */}
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

                {/* Mobile and Desktop content */}
                {details.items.map((item, index) => (
                  <div
                    key={index}
                    className={`${index % 2 === 0 ? "" : "bg-gray-100"}`}
                  >
                    {/* Mobile view - Card layout */}
                    <div className="sm:hidden p-3 border-b border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">Sr. no:</span>
                        <span>{index + 1}</span>
                      </div>
                      <div className="mb-1">
                        <span className="font-bold">Description:</span>
                        <p className="mt-1">{item.name}</p>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">Qty:</span>
                        <span>{item.quantity}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">Unit price (AED):</span>
                        <span>
                          {formatNumberWithCommas(Number(item.unitPrice))}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="font-bold">Amount (AED):</span>
                        <span>
                          {formatNumberWithCommas(Number(item.total))}
                        </span>
                      </div>
                    </div>

                    {/* Desktop view - Table layout */}
                    <div className="hidden sm:grid sm:grid-cols-7 py-1">
                      <div className="text-center">
                        <p className="font-medium text-gray-800">{index + 1}</p>
                      </div>
                      <div className="sm:col-span-3">
                        <p className="font-medium text-gray-800">{item.name}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-800">{item.quantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-800">
                          {formatNumberWithCommas(Number(item.unitPrice))}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-800">
                          {formatNumberWithCommas(Number(item.total))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

              {/* Replace flex layout with table-based layout for proper PDF rendering */}
              <div className="flex-1 mt-4">
                <table className="ml-auto">
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: "150px",
                          textAlign: "right",
                          paddingRight: "8px",
                        }}
                        className="font-semibold text-gray-800"
                      >
                        Subtotal:
                      </td>
                      <td>
                        {formatNumberWithCommas(Number(details.subTotal))}{" "}
                        {details.currency}
                      </td>
                    </tr>

                    {details.discountDetails?.amount != undefined &&
                      details.discountDetails?.amount > 0 && (
                        <tr>
                          <td
                            style={{
                              width: "150px",
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                            className="font-semibold text-gray-800"
                          >
                            Discount:
                          </td>
                          <td>
                            {details.discountDetails.amountType === "amount"
                              ? `- ${details.discountDetails.amount} ${details.currency}`
                              : `- ${details.discountDetails.amount}%`}
                          </td>
                        </tr>
                      )}

                    {details.advancePaymentDetails?.amount != undefined &&
                      details.advancePaymentDetails?.amount > 0 && (
                        <tr>
                          <td
                            style={{
                              width: "150px",
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                            className="font-semibold text-gray-800"
                          >
                            Advance payment:
                          </td>
                          <td>
                            {details.advancePaymentDetails.amountType ===
                            "amount"
                              ? `- ${details.advancePaymentDetails.amount} ${details.currency}`
                              : `- ${details.advancePaymentDetails.amount}%`}
                          </td>
                        </tr>
                      )}

                    {details.taxDetails?.amount != undefined &&
                      details.taxDetails?.amount > 0 && (
                        <tr>
                          <td
                            style={{
                              width: "150px",
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                            className="font-semibold text-gray-800"
                          >
                            VAT:
                          </td>
                          <td>
                            {details.taxDetails.amountType === "amount"
                              ? `+ ${details.taxDetails.amount} ${details.currency}`
                              : `+ ${details.taxDetails.amount}%`}
                          </td>
                        </tr>
                      )}

                    {details.shippingDetails?.cost != undefined &&
                      details.shippingDetails?.cost > 0 && (
                        <tr>
                          <td
                            style={{
                              width: "150px",
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                            className="font-semibold text-gray-800"
                          >
                            Shipping:
                          </td>
                          <td>
                            {details.shippingDetails.costType === "amount"
                              ? `+ ${details.shippingDetails.cost} ${details.currency}`
                              : `+ ${details.shippingDetails.cost}%`}
                          </td>
                        </tr>
                      )}

                    <tr>
                      <td
                        style={{
                          width: "150px",
                          textAlign: "right",
                          paddingRight: "8px",
                        }}
                        className="font-semibold text-gray-800"
                      >
                        Grand Total:
                      </td>
                      <td>
                        {formatNumberWithCommas(Number(details.totalAmount))}{" "}
                        {details.currency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="my-8">
                <div className="my-2">
                  <div className="text-sm flex gap-2">
                    <p className="font-bold w-[6rem]">Bank Name:</p>
                    <p>{details.paymentInformation?.bankName}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold w-[6rem]">Account Name:</p>
                    <p>{details.paymentInformation?.accountName}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold w-[6rem]">Account Class:</p>
                    <p>{details.paymentInformation?.accountClass}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold w-[6rem]">Account No:</p>
                    <p>{details.paymentInformation?.accountNumber}</p>
                  </div>
                  <div className="text-sm flex gap-2">
                    <p className="font-bold w-[6rem]">IBAN:</p>
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
