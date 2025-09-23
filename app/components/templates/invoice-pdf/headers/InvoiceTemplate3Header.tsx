import React from "react";
import { InvoiceType } from "@/types";

type Props = { data: InvoiceType,isForPdf?: boolean; };

export default function InvoiceTemplate3Header({ data,isForPdf }: Props) {
	const { sender, receiver, details } = data;
	const shipTo = (data as any).shipTo || receiver;
	const formatDate = (value: string | Date) => new Date(value).toLocaleDateString("en-US");

	const paddingClass = isForPdf ? "0 60px" : "";

	return (
		<>
			<div id="header-container" style={{ margin: "auto", fontFamily: "ui-sans-serif, system-ui, -apple-system", color: "#000" , padding:paddingClass }}>
				{/* Title */}
				<div style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}>Tax Invoice</div>

				{/* Top header: Seller + Invoice meta */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 0,
						marginTop: 8,
						border: "1px solid rgba(0,0,0,0.7)",
					}}
				>
					{/* Seller */}
				<div style={{ padding: 8,  fontSize: 12, textAlign: "left" }}>
						<div style={{ fontWeight: 600, fontSize: 14 }}>{sender.name}</div>
						<div>{sender.address}</div>
						<div>
							{sender.zipCode}, {sender.city}
						</div>
						<div>{sender.country}</div>
						<div style={{ marginTop: 4 }}>
							<div>Email: {sender.email}</div>
							<div>Phone: {sender.phone}</div>
						</div>
					{(sender as any).gstin && <div style={{ marginTop: 4 }}>GSTIN: {(sender as any).gstin}</div>}
					</div>

				{/* Company logo (beside seller) */}
				<div style={{ padding: 8, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
					{details.invoiceLogo ? (
						<img
							src={details.invoiceLogo}
							alt={`Logo of ${sender.name}`}
							style={{ maxWidth: 160, maxHeight: 120, objectFit: "contain" }}
						/>
					) : (
						<div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>{sender.name}</div>
					)}
				</div>
				</div>

				{/* Consignee / Buyer */}
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "1px solid rgba(0,0,0,0.7)", borderTop: "none" }}>
					{/* Consignee */}
					<div style={{ padding: 8, borderRight: "1px solid rgba(0,0,0,0.7)" }}>
					<div style={{ fontSize: 11 }}>Consignee (Ship to)</div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>{shipTo.name}</div>
					<div style={{ fontSize: 12 }}>{shipTo.address}</div>
						<div style={{ fontSize: 12 }}>
						{shipTo.zipCode}, {shipTo.city}
						</div>
					<div style={{ fontSize: 12 }}>{shipTo.country}</div>
					{(shipTo as any).gstin && <div style={{ fontSize: 12, marginTop: 4 }}>GSTIN: {(shipTo as any).gstin}</div>}
					</div>
					{/* Buyer */}
					<div style={{ padding: 8 }}>
						<div style={{ fontSize: 11 }}>Buyer (Bill to)</div>
						<div style={{ fontWeight: 600, fontSize: 13 }}>{receiver.name}</div>
						<div style={{ fontSize: 12 }}>{receiver.address}</div>
						<div style={{ fontSize: 12 }}>
							{receiver.zipCode}, {receiver.city}
						</div>
						<div style={{ fontSize: 12 }}>{receiver.country}</div>
						{(receiver as any).gstin && <div style={{ fontSize: 12, marginTop: 4 }}>GSTIN: {(receiver as any).gstin}</div>}
					</div>
					<div style={{ fontSize: 11, borderLeft: "1px solid rgba(0,0,0,0.7)", borderRight: "1px solid rgba(0,0,0,0.7)"}}>
						{/* Company GSTIN if available (from taxDetails.taxID or sender.gstin) */}
						{(details.taxDetails?.taxID || (sender as any).gstin) && (
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
								<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>GSTIN</div>
								<div style={{ padding: 4 }}>{details.taxDetails?.taxID || (sender as any).gstin}</div>
							</div>
						)}
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
							<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Invoice No.</div>
							<div style={{ padding: 4 }}>{details.invoiceNumber || ""}</div>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
							<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Dated</div>
							<div style={{ padding: 4 }}>{details.invoiceDate ? formatDate(details.invoiceDate) : ""}</div>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
							<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Mode/Terms of Payment</div>
							<div style={{ padding: 4 }}>{details.paymentTerms || ""}</div>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
							<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Reference No. & Date</div>
							<div style={{ padding: 4 }}>{details.updatedAt || ""}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
