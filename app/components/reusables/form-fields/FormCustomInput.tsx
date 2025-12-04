// Components
import { BaseButton, FormInput } from "@/app/components";

// Icons
import { Trash2 } from "lucide-react";

type FormCustomInputProps = {
    index: number;
    location: string;
    removeField: (index: number) => void;
};

const FormCustomInput = ({
    index,
    location,
    removeField,
}: FormCustomInputProps) => {
    const nameKey = `${location}[${index}].key`;
    const nameValue = `${location}[${index}].value`;
    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <FormInput
                    name={nameKey}
                    placeholder="Name"
                    className="font-medium p-0 border-none h-[1.5rem] w-full md:w-[4rem]"
                />

                <FormInput
                    name={nameValue}
                    placeholder="Value"
                    className="w-full md:w-[10rem]"
                />
                <BaseButton
                    size="icon"
                    variant="destructive"
                    onClick={() => removeField(index)}
                >
                    <Trash2 />
                </BaseButton>
            </div>
        </>
    );
};

export default FormCustomInput;
