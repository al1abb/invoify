"use client";

import React from "react";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

type Props = {};

const WizardNavigation = (props: Props) => {
    const { isFirstStep, isLastStep, handleStep, previousStep, nextStep } =
        useWizard();
    return (
        <div className="flex justify-end gap-5">
            {!isFirstStep && (
                <BaseButton onClick={previousStep}>Prev</BaseButton>
            )}
            <BaseButton disabled={isLastStep} onClick={nextStep}>
                Next
            </BaseButton>
        </div>
    );
};

export default WizardNavigation;
