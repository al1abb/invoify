import type { Invoice, Party, TaxCategory } from "@conformo/core";

// Types
import { InvoiceType } from "@/types";

/**
 * Maps invoify's invoice form data to the EN 16931 semantic model that
 * @conformo/formats serializes to XRechnung. This is a best-effort mapping,
 * not a guarantee: invoify's schema does not collect a few terms XRechnung
 * requires (a seller VAT ID chief among them), so those are recovered from
 * fields that already exist (see findSellerVatId below) rather than adding
 * new required form fields in this first pass. When something truly can't
 * be recovered, @conformo/formats' own buildXRechnungUBL throws an
 * XRechnungError naming exactly which business term (by its BT/BR id) is
 * missing, and exportInvoiceService returns that as the HTTP error body
 * instead of a generic failure.
 */

/**
 * Common country names to their ISO 3166-1 alpha-2 code. invoify collects
 * country as free text; EN 16931 (BT-40/BT-55) requires the ISO code. This
 * covers the EU/EEA plus a few other common trading partners — anything
 * else needs to already be a 2-letter code, or the export fails with a
 * clear message rather than silently producing a non-compliant document.
 */
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
    austria: "AT", belgium: "BE", bulgaria: "BG", croatia: "HR",
    cyprus: "CY", czechia: "CZ", "czech republic": "CZ", denmark: "DK",
    estonia: "EE", finland: "FI", france: "FR", germany: "DE",
    greece: "GR", hungary: "HU", ireland: "IE", italy: "IT",
    latvia: "LV", lithuania: "LT", luxembourg: "LU", malta: "MT",
    netherlands: "NL", poland: "PL", portugal: "PT", romania: "RO",
    slovakia: "SK", slovenia: "SI", spain: "ES", sweden: "SE",
    "united kingdom": "GB", uk: "GB", switzerland: "CH", norway: "NO",
    "united states": "US", usa: "US",
};

export class XRechnungMappingError extends Error {}

function resolveCountry(value: string, field: string): string {
    const trimmed = value.trim();
    if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
    const iso = COUNTRY_NAME_TO_ISO[trimmed.toLowerCase()];
    if (iso) return iso;
    throw new XRechnungMappingError(
        `${field} "${value}" is not a recognized country. Use a 2-letter ISO code (e.g. "DE") or a common country name.`
    );
}

/**
 * invoify's date fields arrive already formatted for display (see
 * lib/schemas.ts's `date` validator), e.g. "September 20, 2026", not ISO —
 * the schema transforms it before this service ever sees it. EN 16931
 * (BT-2/BT-9) needs yyyy-mm-dd.
 */
function toIsoDate(display: string): string {
    const parsed = new Date(display);
    if (Number.isNaN(parsed.getTime())) {
        throw new XRechnungMappingError(`Could not parse date "${display}".`);
    }
    return parsed.toISOString().slice(0, 10);
}

/**
 * invoify has no seller VAT ID field. Rather than add one and grow this
 * change beyond a first pass, look for it in the sender's existing
 * "customInputs" (an already-supported free-form key/value list) under a
 * handful of common key spellings. Returns undefined, not an error, if
 * nothing matches — buildXRechnungUBL will raise its own clear BR-S-02
 * error naming the real requirement.
 */
function findSellerVatId(
    customInputs: { key: string; value: string }[] | undefined
): string | undefined {
    if (!customInputs) return undefined;
    const keys = ["vat id", "vat number", "vatid", "ust-id", "ust-idnr", "tax id"];
    const match = customInputs.find((c) => keys.includes(c.key.trim().toLowerCase()));
    return match?.value.trim() || undefined;
}

function mapParty(
    party: InvoiceType["sender"] | InvoiceType["receiver"],
    countryField: string
): Party {
    return {
        name: party.name,
        street: party.address,
        city: party.city,
        postcode: party.zipCode,
        country: resolveCountry(party.country, countryField),
        electronicAddress: party.email,
        electronicAddressScheme: "EM",
        contact: {
            // invoify doesn't collect a separate contact name; the company
            // name is the best available fallback for BG-6/BG-9.
            name: party.name,
            phone: party.phone,
            email: party.email,
        },
    };
}

/**
 * invoify collects one tax rate/amount for the whole invoice (details.taxDetails),
 * not a rate per line. A percentage applies cleanly as a uniform standard rate
 * (category S) across every line; a fixed amount does not map to a rate at all,
 * so that case is rejected here with a clear message rather than guessed at.
 */
function resolveLineTax(
    taxDetails: InvoiceType["details"]["taxDetails"]
): { category: TaxCategory; rate: number } {
    if (!taxDetails || taxDetails.amount === 0) return { category: "Z", rate: 0 };
    if (taxDetails.amountType !== "percentage") {
        throw new XRechnungMappingError(
            'Only a percentage-based tax rate can be exported as XRechnung today (details.taxDetails.amountType must be "percentage"), because EN 16931 needs a rate per line, not a lump sum.'
        );
    }
    return { category: "S", rate: taxDetails.amount };
}

export function toConformoInvoice(inv: InvoiceType): Invoice {
    const { sender, receiver, details } = inv;
    const { category, rate } = resolveLineTax(details.taxDetails);

    return {
        number: details.invoiceNumber,
        issueDate: toIsoDate(details.invoiceDate),
        dueDate: details.dueDate ? toIsoDate(details.dueDate) : undefined,
        currency: details.currency.toUpperCase(),
        // XRechnung's mandatory buyer reference (BT-10). invoify's closest
        // existing field is the purchase order number; also carried as
        // BT-13 below, since the two terms are allowed to share a value.
        buyerReference: details.purchaseOrderNumber || undefined,
        orderReference: details.purchaseOrderNumber || undefined,
        paymentTerms: details.paymentTerms,
        seller: {
            ...mapParty(sender, "sender.country"),
            vatId: findSellerVatId(sender.customInputs),
        },
        buyer: mapParty(receiver, "receiver.country"),
        payment: {
            // "30" = credit transfer (UNTDID 4461): the generic case that
            // doesn't assume the account number is a real IBAN.
            meansCode: "30",
            accountName: details.paymentInformation?.accountName,
            reference: details.paymentInformation?.bankName,
        },
        lines: details.items.map((item) => ({
            name: item.name,
            description: item.description || undefined,
            quantity: item.quantity,
            unitPriceMinor: Math.round(item.unitPrice * 100),
            // invoify doesn't collect a unit of measure; C62 (UN/ECE Rec 20
            // "piece") is the neutral default the EN 16931 Schematron accepts.
            unitCode: "C62",
            taxCategory: category,
            taxRate: rate,
        })),
    };
}
