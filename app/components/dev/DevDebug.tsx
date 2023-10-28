"use client";

import React, { useMemo } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Component
import { BaseButton } from "@/app/components";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

type Props = {};

const DevDebug = (props: Props) => {
    //? DEV ONLY
    const { reset, formState } = useFormContext();

    //? Form auto fill for testing
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);
    return (
        <>
            {/* //? DEV ONLY */}
            {devEnv && (
                <div className="flex flex-col border-2 border-red-500">
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
            )}
        </>
    );
};

export default DevDebug;
