"use client";

import React from "react";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { WizardNavigation, WizardProgress } from "@/app/components";

type WizardStepProps = {
    children: React.ReactNode;
};

const WizardStep = ({ children }: WizardStepProps) => {
    const wizard = useWizard();
    return (
        <div className="min-h-[25rem]">
            <WizardProgress wizard={wizard} />
            <div className="my-7">{children}</div>
            <WizardNavigation />
        </div>
    );
};

export default WizardStep;
