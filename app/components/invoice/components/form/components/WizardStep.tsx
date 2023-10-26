import React from "react";
import { WizardNavigation } from "@/app/components";

type WizardStepProps = {
    children: React.ReactNode;
};

const WizardStep = ({ children }: WizardStepProps) => {
    return (
        <div>
            <div>{children}</div>
            <WizardNavigation />
        </div>
    );
};

export default WizardStep;
