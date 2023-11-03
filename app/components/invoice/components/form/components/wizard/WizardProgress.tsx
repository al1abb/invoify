"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// React Wizard
import { WizardValues } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/app/contexts/TranslationContext";

// Types
import { InvoiceType, WizardStepType } from "@/app/types/types";

type WizardProgressProps = {
    wizard: WizardValues;
};

const WizardProgress = ({ wizard }: WizardProgressProps) => {
    const { activeStep, stepCount } = wizard;

    const {
        formState: { errors },
    } = useFormContext<InvoiceType>();

    const { _t } = useTranslationContext();

    const step1Valid = !errors.sender && !errors.receiver;
    const step2Valid =
        !errors.details?.invoiceNumber &&
        !errors.details?.dueDate &&
        !errors.details?.invoiceDate &&
        !errors.details?.currency;

    const step3Valid = !errors.details?.items;
    const step4Valid = !errors.details?.paymentInformation;
    const step5Valid =
        !errors.details?.paymentTerms &&
        !errors.details?.subTotal &&
        !errors.details?.totalAmount;

    const returnButtonVariant = (step: WizardStepType) => {
        if (!step.isValid) {
            return "destructive";
        }
        if (step.id === activeStep) {
            return "default";
        } else {
            return "outline";
        }
    };

    // ? Old method of targeting stepCount from react use wizard library
    // Create an array with stepCount number of elements
    // const stepArray = Array.from({ length: stepCount }, (_, index) => index);

    const steps: WizardStepType[] = [
        {
            id: 0,
            label: _t("form.wizard.fromAndTo"),
            isValid: step1Valid,
        },
        {
            id: 1,
            label: _t("form.wizard.invoiceDetails"),
            isValid: step2Valid,
        },
        {
            id: 2,
            label: _t("form.wizard.lineItems"),
            isValid: step3Valid,
        },
        {
            id: 3,
            label: _t("form.wizard.paymentInfo"),
            isValid: step4Valid,
        },
        {
            id: 4,
            label: _t("form.wizard.summary"),
            isValid: step5Valid,
        },
    ];

    return (
        <div className="flex flex-wrap justify-around items-center gap-y-3">
            {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                    <BaseButton
                        variant={returnButtonVariant(step)}
                        className="w-auto"
                        onClick={() => {
                            wizard.goToStep(step.id);
                        }}
                    >
                        {step.id + 1}. {step.label}
                    </BaseButton>

                    {step.id != stepCount - 1 && (
                        <div className="w-[3rem] h-0.5 bg-black hidden md:block"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default WizardProgress;
