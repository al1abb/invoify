"use client";

import { useState } from "react";

// ShadCn
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Components
import { SavedInvoicesList } from "@/app/components";
import { ImportJsonButton } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

type InvoiceLoaderModalType = {
  children: React.ReactNode;
};

const InvoiceLoaderModal = ({ children }: InvoiceLoaderModalType) => {
  const [open, setOpen] = useState(false);

  const { savedInvoices } = useInvoiceContext();
  const { _t } = useTranslationContext();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle>{_t("savedInvoices.title")}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                {_t("savedInvoices.descriptionPrefix")} {savedInvoices.length}{" "}
                {_t("savedInvoices.descriptionSuffix")}
              </p>
              <ImportJsonButton setOpen={setOpen} />
            </div>
          </DialogDescription>
        </DialogHeader>

        <SavedInvoicesList setModalState={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceLoaderModal;
