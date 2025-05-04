"use client";

// Components
import { DatePickerFormField, FormInput, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const InvoiceDetails = () => {
  const { _t } = useTranslationContext();

  return (
    <section className="flex flex-col flex-wrap gap-5">
      <Subheading>{_t("form.steps.invoiceDetails.heading")}:</Subheading>

      <div className="flex flex-row flex-wrap gap-5">
        <div className="flex flex-col gap-2">
          <FormInput
            name="details.quotationNumber"
            label={_t("form.steps.invoiceDetails.quotationNumber")}
            placeholder="Quotation number"
          />

          <DatePickerFormField
            name="details.invoiceDate"
            label={_t("form.steps.invoiceDetails.issuedDate")}
          />

          <FormInput
            name="details.invoiceNumber"
            label={_t("form.steps.invoiceDetails.invoiceNumber")}
            placeholder="Invoice number"
          />

          <FormInput
            name="details.salesPerson"
            label={_t("form.steps.invoiceDetails.salesPerson")}
            placeholder="Sales person"
          />

          <DatePickerFormField
            name="details.dueDate"
            label={_t("form.steps.invoiceDetails.dueDate")}
          />
        </div>

        <div className="flex flex-col gap-2">{/* <TemplateSelector /> */}</div>
      </div>
    </section>
  );
};

export default InvoiceDetails;
