"use client";

import React, { useMemo } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// React Wizard
import { WizardValues } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Types
import { ValuesType, WizardStepType } from "@/app/types/types";

type WizardProgressProps = {
    wizard: WizardValues;
};

const WizardProgress = ({ wizard }: WizardProgressProps) => {
    const { activeStep, stepCount } = wizard;

    const {
        formState: { errors },
    } = useFormContext<ValuesType>();

    const step1Valid = !errors.sender && !errors.receiver;
    const step2Valid =
        !errors.details?.invoiceNumber &&
        !errors.details?.dueDate &&
        !errors.details?.invoiceDate &&
        !errors.details?.currency;

    const step3Valid = !errors.details?.items;
    const step4Valid = !errors.details?.paymentInformation;
    const step5Valid = !errors.details;

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
            label: "From & To",
            isValid: step1Valid,
        },
        {
            id: 1,
            label: "Invoice Details",
            isValid: step2Valid,
        },
        {
            id: 2,
            label: "Line Items",
            isValid: step3Valid,
        },
        {
            id: 3,
            label: "Payment Information",
            isValid: step4Valid,
        },
        {
            id: 4,
            label: "Final notes",
            isValid: step5Valid,
        },
    ];

    return (
        <div className="flex justify-around items-center">
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
                        <div className="w-[4rem] h-0.5 bg-black"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default WizardProgress;
