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

const BillFromSection = () => {
    const { control } = useFormContext();

    const { _t } = useTranslationContext();

    const CUSTOM_INPUT_NAME = "sender.customInputs";
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
            <Subheading>{_t("form.steps.fromAndTo.billFrom")}:</Subheading>

            <FormInput
                name="sender.name"
                label={_t("form.steps.fromAndTo.name")}
                placeholder="Your name"
            />
            <FormInput
                name="sender.address"
                label={_t("form.steps.fromAndTo.address")}
                placeholder="Your address"
            />
            <FormInput
                name="sender.zipCode"
                label={_t("form.steps.fromAndTo.zipCode")}
                placeholder="Your zip code"
            />
            <FormInput
                name="sender.city"
                label={_t("form.steps.fromAndTo.city")}
                placeholder="Your city"
            />
            <FormInput
                name="sender.country"
                label={_t("form.steps.fromAndTo.country")}
                placeholder="Your country"
            />
            <FormInput
                name="sender.email"
                label={_t("form.steps.fromAndTo.email")}
                placeholder="Your email"
            />
            <FormInput
                name="sender.phone"
                label={_t("form.steps.fromAndTo.phone")}
                placeholder="Your phone number"
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
                tooltipLabel="Add custom input to sender"
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

export default BillFromSection;
