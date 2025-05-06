"use client";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// Components
import { FormInput, FormTextarea, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons

const BillToSection = () => {
  const { control } = useFormContext();

  const { _t } = useTranslationContext();

  const CUSTOM_INPUT_NAME = "receiver.customInputs";

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: CUSTOM_INPUT_NAME,
  });

  const addNewCustomInput = () => {
    append({
      key: "",
      value: "",
    });
  };

  const removeCustomInput = (index: number) => {
    remove(index);
  };

  return (
    <section className="flex flex-col gap-3">
      <Subheading>{_t("form.steps.to.billTo")}:</Subheading>

      <FormInput
        name="receiver.name"
        label={_t("form.steps.to.name")}
        placeholder="Receiver name"
      />
      <FormInput
        name="receiver.email"
        label={_t("form.steps.to.email")}
        placeholder="Receiver email"
      />
      <FormInput
        name="receiver.phone"
        label={_t("form.steps.to.phone")}
        placeholder="Receiver phone number"
        type="text"
        inputMode="tel"
        pattern="[0-9+\-\(\)\s]*"
        aria-describedby="phone-format"
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^\d\+\-\(\)\s]/g, "");
        }}
      />
      <FormInput
        name="receiver.website"
        label={_t("form.steps.to.website")}
        placeholder="Receiver website"
      />
      <FormTextarea
        name="receiver.address"
        label={_t("form.steps.to.address")}
        placeholder="Receiver address"
      />
    </section>
  );
};

export default BillToSection;
