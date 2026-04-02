import React from "react";

import { Document, Page, View, Text, Image } from "@formepdf/react";
import { tw } from "@formepdf/tailwind";
import { readFileSync } from "fs";
import { join } from "path";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/pdf-helpers";

// Types
import { InvoiceType } from "@/types";

// Load Outfit font family.
// In Next.js, process.cwd() is the project root so readFileSync works.
// In VS Code preview, cwd differs so readFileSync throws ENOENT — fall back
// to a relative path string which the renderer resolves from this file's dir.
const fontsDir = join(process.cwd(), "fonts");
const fontFiles = ["Outfit-Regular.ttf", "Outfit-Medium.ttf", "Outfit-SemiBold.ttf", "Outfit-Bold.ttf"] as const;
const fontWeights = [400, 500, 600, 700] as const;

function loadFont(file: string): string | Buffer {
	try {
		return readFileSync(join(fontsDir, file));
	} catch {
		// VS Code preview: fs unavailable or wrong cwd — use relative path
		return join("../../../../fonts", file);
	}
}

const outfitFonts = fontFiles.map((file, i) => ({
	family: "Outfit" as const,
	src: loadFont(file),
	fontWeight: fontWeights[i],
}));

const InvoiceTemplate2 = (data: InvoiceType) => {
	const { sender, receiver, details } = data;

	return (
		<Document title={`Invoice ${details.invoiceNumber}`} fonts={outfitFonts}>
			<Page size="A4" margin={30} style={{ fontFamily: "Outfit" }}>
				{/* Header */}
				<View style={tw("flex-row justify-between")}>
					<View>
						<Text style={tw("text-xl font-semibold text-gray-800")}>Invoice #</Text>
						<Text style={tw("mt-1 text-gray-500")}>{details.invoiceNumber}</Text>
						{details.invoiceLogo && details.invoiceLogo !== "" && isDataUrl(details.invoiceLogo) ? (
							<Image
								src={details.invoiceLogo}
								width={140}
							/>
						) : null}
						<Text style={tw("mt-2 text-[14px] font-semibold text-blue-600")}>{sender.name}</Text>
					</View>
					<View style={tw("text-right")}>
						<View style={tw("mt-4")}>
							<Text style={tw("text-gray-800")}>{sender.address}</Text>
							<Text style={tw("text-gray-800")}>{sender.zipCode}, {sender.city}</Text>
							<Text style={tw("text-gray-800")}>{sender.country}</Text>
						</View>
					</View>
				</View>

				{/* Bill To + Dates */}
				<View style={tw("mt-4 flex-row gap-3")}>
					<View style={{ flex: 1 }}>
						<Text style={tw("text-md font-semibold text-gray-800")}>Bill to:</Text>
						<Text style={tw("text-md font-semibold text-gray-800 mt-1")}>{receiver.name}</Text>
						<View style={tw("mt-[12px]")}>
							<Text style={tw("text-gray-500")}>
								{[receiver.address, receiver.zipCode].filter(Boolean).join(", ")}
							</Text>
							<Text style={tw("text-gray-500 mt-[2px]")}>{receiver.city}, {receiver.country}</Text>
						</View>
					</View>
					<View style={{ flex: 1, ...tw("gap-2") }}>
						<View style={tw("flex-row gap-12")}>
							<Text style={{ flex: 3, ...tw("font-semibold text-gray-800 text-right") }}>Invoice date:</Text>
							<Text style={{ flex: 2, ...tw("text-gray-500 text-right") }}>
								{details.invoiceDate}
							</Text>
						</View>
						<View style={tw("flex-row gap-12")}>
							<Text style={{ flex: 3, ...tw("font-semibold text-gray-800 text-right") }}>Due date:</Text>
							<Text style={{ flex: 2, ...tw("text-gray-500 text-right") }}>
								{details.dueDate}
							</Text>
						</View>
					</View>
				</View>

				{/* Items Table */}
				<View style={tw("mt-2 border border-gray-200 p-1 rounded-lg")}>
					{/* Header Row */}
					<View style={tw("flex-row")}>
						<View style={{ flex: 2 }}>
							<Text style={tw("text-[8px] font-medium text-gray-500 uppercase")}>Item</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={tw("text-[8px] font-medium text-gray-500 uppercase")}>Qty</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={tw("text-[8px] font-medium text-gray-500 uppercase")}>Rate</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={tw("text-[8px] font-medium text-gray-500 uppercase text-right")}>Amount</Text>
						</View>
					</View>
					<View style={tw("border-b border-gray-200 mt-1 mb-1")} />

					{/* Item Rows */}
					{details.items.map((item, index) => (
						<View key={index} style={tw("flex-row border-b border-gray-300 pt-[2px] pb-[2px]")}>
							<View style={{ flex: 2 }}>
								<Text style={tw("text-[11px] font-bold text-gray-800")}>{item.name}</Text>
								<Text style={tw("text-[9px] text-gray-600")}>{item.description}</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={tw("text-gray-800")}>{item.quantity}</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={tw("text-gray-800")}>{item.unitPrice} {details.currency}</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={tw("text-right text-gray-800")}>{item.total} {details.currency}</Text>
							</View>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={tw("mt-1 flex-row justify-end")}>
					<View style={{ width: 350, ...tw("gap-[7px]") }}>
						<View style={tw("flex-row")}>
							<View style={{ flex: 4 }}>
								<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Subtotal:</Text>
							</View>
							<View style={{ flex: 4 }}>
								<Text style={tw("text-gray-500 text-right")}>{formatNumberWithCommas(Number(details.subTotal))} {details.currency}</Text>
							</View>
						</View>
						{details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
							<View style={tw("flex-row")}>
								<View style={{ flex: 4 }}>
									<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Discount:</Text>
								</View>
								<View style={{ flex: 4 }}>
									<Text style={tw("text-gray-500 text-right")}>
										{details.discountDetails.amountType === "amount"
											? `- ${details.discountDetails.amount} ${details.currency}`
											: `- ${details.discountDetails.amount}%`}
									</Text>
								</View>
							</View>
						)}
						{details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
							<View style={tw("flex-row")}>
								<View style={{ flex: 4 }}>
									<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Tax:</Text>
								</View>
								<View style={{ flex: 4 }}>
									<Text style={tw("text-gray-500 text-right")}>
										{details.taxDetails.amountType === "amount"
											? `+ ${details.taxDetails.amount} ${details.currency}`
											: `+ ${details.taxDetails.amount}%`}
									</Text>
								</View>
							</View>
						)}
						{details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
							<View style={tw("flex-row")}>
								<View style={{ flex: 4 }}>
									<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Shipping:</Text>
								</View>
								<View style={{ flex: 4 }}>
									<Text style={tw("text-gray-500 text-right")}>
										{details.shippingDetails.costType === "amount"
											? `+ ${details.shippingDetails.cost} ${details.currency}`
											: `+ ${details.shippingDetails.cost}%`}
									</Text>
								</View>
							</View>
						)}
						<View style={tw("flex-row")}>
							<View style={{ flex: 4 }}>
								<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Total:</Text>
							</View>
							<View style={{ flex: 4 }}>
								<Text style={tw("text-gray-500 text-right")}>{formatNumberWithCommas(Number(details.totalAmount))} {details.currency}</Text>
							</View>
						</View>
						{details.totalAmountInWords && (
							<View style={tw("flex-row")}>
								<View style={{ flex: 4 }}>
									<Text style={tw("font-semibold text-gray-800 text-right mr-6")}>Total in words:</Text>
								</View>
								<View style={{ flex: 4 }}>
									<Text style={tw("italic text-gray-500 text-right")}>{details.totalAmountInWords} {details.currency}</Text>
								</View>
							</View>
						)}
					</View>
				</View>

				{/* Notes & Payment */}
				<View style={tw("mt-2")}>
					<View style={tw("mt-2")}>
						<Text style={tw("font-semibold text-blue-600")}>Additional notes:</Text>
						<Text style={tw("text-gray-800")}>{details.additionalNotes}</Text>
					</View>
					<View style={tw("mt-2")}>
						<Text style={tw("font-semibold text-blue-600")}>Payment terms:</Text>
						<Text style={tw("text-gray-800")}>{details.paymentTerms}</Text>
					</View>
					<View style={tw("mt-2")}>
						<Text style={tw("font-semibold text-gray-800")}>Please send the payment to this address</Text>
						<Text style={tw("text-[10px] font-bold text-gray-800")}>Bank: {details.paymentInformation?.bankName}</Text>
						<Text style={tw("text-[10px] font-bold text-gray-800")}>Account name: {details.paymentInformation?.accountName}</Text>
						<Text style={tw("text-[10px] font-bold text-gray-800")}>Account no: {details.paymentInformation?.accountNumber}</Text>
					</View>
				</View>

				<View style={{marginTop: 14}}>
					<Text style={tw("text-gray-500 text-[10px]")}>
						If you have any questions concerning this invoice, use the following contact information:
					</Text>
					<Text style={tw("text-[10px] font-bold text-gray-800")}>{sender.email}</Text>
					<Text style={tw("text-[10px] font-bold text-gray-800")}>{sender.phone}</Text>
				</View>

				{/* Signature */}
				{details?.signature?.data && isDataUrl(details?.signature?.data) ? (
					<View style={tw("mt-6")}>
						<Text style={tw("font-semibold text-gray-800")}>Signature:</Text>
						<Image
							src={details.signature.data}
							width={120}
						/>
					</View>
				) : details?.signature?.data ? (
					<View style={tw("mt-6")}>
						<Text style={tw("text-gray-800")}>Signature:</Text>
						<Text style={{ fontSize: 30, fontWeight: 400, color: tw("text-black").color }}>
							{details.signature.data}
						</Text>
					</View>
				) : null}
			</Page>
		</Document>
	);
};

export default InvoiceTemplate2;
