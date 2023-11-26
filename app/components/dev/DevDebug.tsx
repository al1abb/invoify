"use client";

// Next
import Link from "next/link";

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
        <div className="flex border-2 border-red-500 rounded-md">
            <div className="flex flex-col">
                <b>DEV:</b>
                Form: {formState.isDirty ? "Dirty" : "Clean"}
                <BaseButton
                    tooltipLabel="Form Test Fill"
                    variant="outline"
                    onClick={() => reset(FORM_FILL_VALUES)}
                >
                    Fill in the form
                </BaseButton>
            </div>

            <div className="flex flex-col">
                <Link href={`/template/1`}>Template 1</Link>
                <Link href={`/template/2`}>Template 2</Link>
            </div>
        </div>
    );
};

export default DevDebug;
