"use client";

import React from "react";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { WizardNavigation } from "@/app/components";

type WizardStepProps = {
    children: React.ReactNode;
};

const WizardStep = ({ children }: WizardStepProps) => {
    const { activeStep, stepCount } = useWizard();
    return (
        <div className="min-h-[25rem]">
            Step: {activeStep + 1} / {stepCount}
            <div>{children}</div>
            <WizardNavigation />
        </div>
    );
};

export default WizardStep;
