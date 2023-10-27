"use client";

import React from "react";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {};

const WizardNavigation = (props: Props) => {
    const { isFirstStep, isLastStep, handleStep, previousStep, nextStep } =
        useWizard();
    return (
        <div className="flex justify-end gap-5">
            {!isFirstStep && (
                <BaseButton
                    tooltipLabel="Go back to the previous step"
                    onClick={previousStep}
                >
                    <ArrowLeft />
                    Back
                </BaseButton>
            )}
            <BaseButton
                tooltipLabel="Go to the next step"
                disabled={isLastStep}
                onClick={nextStep}
            >
                Next
                <ArrowRight />
            </BaseButton>
        </div>
    );
};

export default WizardNavigation;
