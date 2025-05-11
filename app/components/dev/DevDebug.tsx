"use client";

import { BaseButton } from "@/app/components";
import { FORM_FILL_VALUES } from "@/lib/variables";
import { useFormContext } from "react-hook-form";

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
    </div>
  );
};

export default DevDebug;
