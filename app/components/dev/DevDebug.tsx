"use client";

// Next
import { Link } from "@/i18n/navigation";

// RHF
import { useFormContext } from "react-hook-form";

// Component
import { BaseButton } from "@/app/components";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

type DevDebugProps = {};

const DevDebug = ({}: DevDebugProps) => {
    const { reset, formState } = useFormContext();
    return (
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-xs">
            <span className="text-gray-600">DEV</span>
            <BaseButton
                tooltipLabel="Fill form with test data"
                variant="ghost"
                size="sm"
                onClick={() => reset(FORM_FILL_VALUES)}
                className="h-6 px-2 text-xs"
            >
                Fill
            </BaseButton>
        </div>
    );
};

export default DevDebug;
