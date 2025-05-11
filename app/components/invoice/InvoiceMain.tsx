"use client";

import { useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { InvoiceActions, InvoiceForm } from "@/app/components";
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { InvoiceType } from "@/types";

const InvoiceMain = () => {
  const { handleSubmit } = useFormContext<InvoiceType>();

  const { onFormSubmit } = useInvoiceContext();

  return (
    <>
      <Form {...useFormContext<InvoiceType>()}>
        <form
          onSubmit={handleSubmit(onFormSubmit, (err) => {
            console.log(err);
          })}
        >
          <div className="flex flex-wrap">
            <InvoiceForm />
            <InvoiceActions />
          </div>
        </form>
      </Form>
    </>
  );
};

export default InvoiceMain;
