// Components
import { BaseButton } from "@/app/components";

// Icons
import { Check } from "lucide-react";

// Types
import { SignatureColor } from "@/types";

type SignatureColorSelectorProps = {
    colors: SignatureColor[];
    selectedColor: string;
    handleColorButtonClick: (color: string) => void;
};

const SignatureColorSelector = ({
    colors,
    selectedColor,
    handleColorButtonClick,
}: SignatureColorSelectorProps) => {
    return (
        <div className="flex gap-2">
            {colors.map((color) => (
                <BaseButton
                    key={color.color}
                    size="icon"
                    tooltipLabel={color.label}
                    style={{
                        backgroundColor: color.color,
                    }}
                    className="flex justify-center items-center h-6 w-6 rounded-full border-2 hover:border-blue-700"
                    onClick={() => handleColorButtonClick(color.color)}
                >
                    {selectedColor === color.color && (
                        <span className="text-white">
                            <Check size={16} />
                        </span>
                    )}
                </BaseButton>
            ))}
        </div>
    );
};

export default SignatureColorSelector;
