"use client";

import {
  BillToSection,
  InvoiceDetails,
  InvoiceSummary,
  Items,
  WizardStep,
} from "@/app/components";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Wizard } from "react-use-wizard";

const InvoiceForm = () => {
  const { _t } = useTranslationContext();

  const { control } = useFormContext();

  // Get invoice number variable
  const invoiceNumber = useWatch({
    name: "details.invoiceNumber",
    control,
  });

  const invoiceNumberLabel = useMemo(() => {
    if (invoiceNumber) {
      return `#${invoiceNumber}`;
    } else {
      return _t("form.newInvBadge");
    }
  }, [invoiceNumber]);

  return (
    <div className={`xl:w-[55%]`}>
      <Card>
        <CardHeader>
          <div className="flex gap-3">
            <CardTitle className="flex items-center gap-3">
              <span className="uppercase">{_t("form.title")}</span>
            </CardTitle>
            <Badge variant="secondary" className="w-fit">
              <p style={{ fontSize: "14px" }}>{invoiceNumberLabel}</p>
            </Badge>
          </div>
          <CardDescription>{_t("form.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Wizard>
              <WizardStep>
                <div className="flex gap-x-20 gap-y-10">
                  <BillToSection />
                </div>
              </WizardStep>
              <WizardStep>
                <div className="flex flex-wrap gap-y-10">
                  <InvoiceDetails />
                </div>
              </WizardStep>

              <WizardStep>
                <Items />
              </WizardStep>

              <WizardStep>
                <InvoiceSummary />
              </WizardStep>
            </Wizard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
