"use client";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// Components
import {
    BaseButton,
    FormCustomInput,
    FormInput,
    Subheading,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { Plus } from "lucide-react";

const ShipToSection = () => {
    const { control } = useFormContext();

    const { _t } = useTranslationContext();

    const CUSTOM_INPUT_NAME = "shipTo.customInputs";
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
            <Subheading>{_t?.("form.steps.fromAndTo.shipTo") || "Ship To:"}</Subheading>
            <FormInput
                name="shipTo.name"
                label={_t("form.steps.fromAndTo.name")}
                placeholder="Ship to name"
            />
            <FormInput
                name="shipTo.address"
                label={_t("form.steps.fromAndTo.address")}
                placeholder="Ship to address"
            />
            <FormInput
                name="shipTo.zipCode"
                label={_t("form.steps.fromAndTo.zipCode")}
                placeholder="Ship to zip code"
            />
            <FormInput
                name="shipTo.city"
                label={_t("form.steps.fromAndTo.city")}
                placeholder="Ship to city"
            />
            <FormInput
                name="shipTo.country"
                label={_t("form.steps.fromAndTo.country")}
                placeholder="Ship to country"
            />
            <FormInput
                name="shipTo.email"
                label={_t("form.steps.fromAndTo.email")}
                placeholder="Ship to email"
            />
            <FormInput
                name="shipTo.gstin"
                label="GSTIN"
                placeholder="Ship to GSTIN (e.g., 22ABCDE1234F1Z5)"
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.toUpperCase();
                }}
            />
            {/* //? key = field.id fixes a bug where wrong field gets deleted  */}
            {fields?.map((field, index) => (
                <FormCustomInput
                    key={field.id}
                    index={index}
                    location={CUSTOM_INPUT_NAME}
                    removeField={removeCustomInput}
                />
            ))}
            <BaseButton
                tooltipLabel="Add custom input to ship to"
                size="sm"
                variant="link"
                className="w-fit"
                onClick={addNewCustomInput}
            >
                <Plus />
                {_t("form.steps.fromAndTo.addCustomInput")}
            </BaseButton>
        </section>
    );
};

export default ShipToSection;


