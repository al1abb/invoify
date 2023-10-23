import React from "react";

// Shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
import { SignatureFont } from "@/app/types/types";

type SignatureFontSelectorProps = {
    typedSignatureFonts: SignatureFont[];
    selectedFont: string;
    setSelectedFont: (value: string) => void;
};

const SignatureFontSelector = ({
    typedSignatureFonts,
    selectedFont,
    setSelectedFont,
}: SignatureFontSelectorProps) => {
    return (
        <div className="flex gap-2">
            {/* Font select */}
            <Select
                defaultValue={typedSignatureFonts[0].variable}
                onValueChange={setSelectedFont}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Font" />
                </SelectTrigger>
                <SelectContent>
                    {typedSignatureFonts.map((font) => (
                        <SelectItem
                            key={font.name}
                            value={font.variable}
                            style={{
                                fontFamily: selectedFont,
                                fontSize: 24,
                            }}
                            className="py-2"
                        >
                            {font.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SignatureFontSelector;
