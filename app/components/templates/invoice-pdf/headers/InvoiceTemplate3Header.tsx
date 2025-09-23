import React from "react";
import { InvoiceType } from "@/types";

type Props = { data: InvoiceType };

export default function InvoiceTemplate3Header({ data }: Props) {
	const { sender, receiver, details } = data;
	const formatDate = (value: string | Date) => new Date(value).toLocaleDateString("en-US");

	return (
		<div id="header-container" style={{ width: "85%", margin: "auto", fontFamily: "ui-sans-serif, system-ui, -apple-system", color: "#000" }}>
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
				<div style={{ padding: 8, borderRight: "1px solid rgba(0,0,0,0.7)", fontSize: 12, textAlign: "left" }}>
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
				</div>

				{/* Invoice / Dispatch details */}
				<div style={{ fontSize: 11 }}>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
						<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Invoice No.</div>
						<div style={{ padding: 4 }}>{details.invoiceNumber || ""}</div>
					</div>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
						<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Dated</div>
						<div style={{ padding: 4 }}>{details.invoiceDate ? formatDate(details.invoiceDate) : ""}</div>
					</div>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.7)" }}>
						<div style={{ padding: 4, borderRight: "1px solid rgba(0,0,0,0.7)" }}>Delivery Note</div>
						<div style={{ padding: 4 }}>{details.purchaseOrderNumber || ""}</div>
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

			{/* Consignee / Buyer */}
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(0,0,0,0.7)", borderTop: "none" }}>
				{/* Consignee */}
				<div style={{ padding: 8, borderRight: "1px solid rgba(0,0,0,0.7)" }}>
					<div style={{ fontSize: 11 }}>Consignee (Ship to)</div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>{receiver.name}</div>
					<div style={{ fontSize: 12 }}>{receiver.address}</div>
					<div style={{ fontSize: 12 }}>
						{receiver.zipCode}, {receiver.city}
					</div>
					<div style={{ fontSize: 12 }}>{receiver.country}</div>
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
				</div>
			</div>
		</div>
	);
}
