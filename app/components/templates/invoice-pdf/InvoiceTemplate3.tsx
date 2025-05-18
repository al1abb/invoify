import React from "react";
import Image from "next/image";
import { InvoiceLayout } from "@/app/components";
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
import { DATE_OPTIONS } from "@/lib/variables";
import { InvoiceType } from "@/types";
import n2words from "n2words";

const InvoiceTemplate3 = (data: InvoiceType) => {
  const { sender, receiver, details } = data;
  // Forcer la devise à Francs CFA
  const currency = "F CFA";
  // Calcul du total TTC à partir des items et des champs de détails
  const itemsTotal = details.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  let totalValid = itemsTotal;
  if (details.discountDetails?.amount && details.discountDetails.amountType === "amount") {
    totalValid -= Number(details.discountDetails.amount) || 0;
  }
  if (details.taxDetails?.amount && details.taxDetails.amountType === "amount") {
    totalValid += Number(details.taxDetails.amount) || 0;
  }
  if (details.shippingDetails?.cost && details.shippingDetails.costType === "amount") {
    totalValid += Number(details.shippingDetails.cost) || 0;
  }
  if (isNaN(totalValid)) totalValid = 0;
  const totalInWords = n2words(totalValid, { lang: "fr" }).toUpperCase();

  return (
    <InvoiceLayout data={data}>
      {/* Fond du template en watermark */}
      <div
        style={{
          position: "relative",
          minHeight: 1122, // A4 height px @ 96dpi (valeur standard pour A4 portrait)
          backgroundImage: 'url("/assets/img/invoice3.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain", // pour éviter le rognage
          backgroundPosition: "top center",
          padding: 0,
        }}
      >
        {/* Header avec logo et slogan */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "32px 32px 0 32px" }}>
          {/* ...logo et autres éléments... */}
        </div>
        {/* Présentation Propriétaire / Destinataire */}
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, margin: '32px 32px 0 32px'}}>
          {/* Propriétaire (Émetteur) */}
          <div style={{background: '#222', color: '#fff', padding: 16, borderRadius: 8, width: '48%'}}>
            <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>FACTURE N°. {details.invoiceNumber}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>Date : {new Date(details.invoiceDate).toLocaleDateString('fr-FR')}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>Référence : {details.invoiceNumber}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>Émis par : {sender.name}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{sender.address}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{sender.zipCode}, {sender.city}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{sender.country}</div>
            {sender.email && <div style={{fontSize: 12, marginBottom: 4}}>Email : {sender.email}</div>}
            {sender.phone && <div style={{fontSize: 12, marginBottom: 4}}>Contact : {sender.phone}</div>}
          </div>
          {/* Destinataire */}
          <div style={{background: '#222', color: '#fff', padding: 16, borderRadius: 8, width: '48%', textAlign: 'right'}}>
            <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>{(receiver.name || '').toUpperCase()}</div>
            <div style={{fontWeight: 'bold', fontSize: 12, marginBottom: 4, textDecoration: 'underline'}}>DESTINATAIRE</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{receiver.address || ''}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{receiver.zipCode || ''}, {receiver.city || ''}</div>
            <div style={{fontSize: 12, marginBottom: 4}}>{receiver.country || ''}</div>
            {receiver.email && <div style={{fontSize: 12, marginBottom: 4}}>Email : {receiver.email}</div>}
            {receiver.phone && <div style={{fontSize: 12, marginBottom: 4}}>Tél : {receiver.phone}</div>}
          </div>
        </div>
        {/* ...reste du contenu... */}
        {/* Items table */}
        <div style={{ marginTop: 32, padding: "0 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "rgba(255,255,255,0.97)" }}>
            <thead>
              <tr style={{ background: "#0056a3", color: "#fff" }}>
                <th style={{ padding: 8, border: "1px solid #0056a3" }}>#</th>
                <th style={{ padding: 8, border: "1px solid #0056a3" }}>ITEMS DESCRIPTIONS</th>
                <th style={{ padding: 8, border: "1px solid #0056a3" }}>QTY</th>
                <th style={{ padding: 8, border: "1px solid #0056a3" }}>PRIX U.</th>
                <th style={{ padding: 8, border: "1px solid #0056a3" }}>PRIX TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {details.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8, border: "1px solid #0056a3", textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ padding: 8, border: "1px solid #0056a3" }}>{item.description || item.name}</td>
                  <td style={{ padding: 8, border: "1px solid #0056a3", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: 8, border: "1px solid #0056a3", textAlign: "right" }}>{item.unitPrice} {currency}</td>
                  <td style={{ padding: 8, border: "1px solid #0056a3", textAlign: "right" }}>{item.total} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", padding: "0 32px" }}>
          <table style={{ minWidth: 280, fontSize: 13, background: "rgba(255,255,255,0.97)" }}>
            <tbody>
              <tr>
                <td style={{ padding: 4 }}>Sous-total :</td>
                <td style={{ padding: 4, textAlign: "right" }}>{formatNumberWithCommas(Number(details.subTotal))} {currency}</td>
              </tr>
              {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                <tr>
                  <td style={{ padding: 4 }}>Remise :</td>
                  <td style={{ padding: 4, textAlign: "right" }}>
                    {details.discountDetails.amountType === "amount"
                      ? `- ${details.discountDetails.amount} ${currency}`
                      : `- ${details.discountDetails.amount}%`}
                  </td>
                </tr>
              )}
              {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
                <tr>
                  <td style={{ padding: 4 }}>Taxe :</td>
                  <td style={{ padding: 4, textAlign: "right" }}>
                    {details.taxDetails.amountType === "amount"
                      ? `+ ${details.taxDetails.amount} ${currency}`
                      : `+ ${details.taxDetails.amount}%`}
                  </td>
                </tr>
              )}
            {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
              <tr>
                <td style={{ padding: 4 }}>Livraison :</td>
                <td style={{ padding: 4, textAlign: "right" }}>
                  {details.shippingDetails.costType === "amount"
                    ? `+ ${details.shippingDetails.cost} ${currency}`
                    : `+ ${details.shippingDetails.cost}%`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes, paiement, signature */}
      <div style={{ marginTop: 32 }}>
        {details.additionalNotes && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#0056a3", fontWeight: 600 }}>Notes :</span> {details.additionalNotes}
          </div>
        )}
        {details.paymentTerms && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#0056a3", fontWeight: 600 }}>Modalités de paiement :</span> {details.paymentTerms}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#0056a3", marginTop: 16 }}>
            Arrêtée la présente FACTURE à la Somme de :<br />
            <span style={{ fontWeight: 600 }}>
              {totalInWords} ({formatNumberWithCommas(totalValid)}) Francs CFA TTC.
            </span>
        </div>
        {/* Signature alignée à droite */}
        {details?.signature?.data && isDataUrl(details.signature.data) ? (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{textAlign: 'right'}}>
              <span style={{ fontWeight: 600 }}>Signature :</span><br />
              <Image src={details.signature.data} width={120} height={60} alt={`Signature de ${sender.name}`} />
            </div>
          </div>
        ) : details.signature?.data ? (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{textAlign: 'right'}}>
              <span style={{ fontWeight: 600 }}>Signature :</span><br />
              <span style={{ fontSize: 30, fontFamily: `${details.signature.fontFamily || 'cursive'}, cursive`, color: "black" }}>{details.signature.data}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}

    </div>
    </InvoiceLayout>
  );
};

export default InvoiceTemplate3;
