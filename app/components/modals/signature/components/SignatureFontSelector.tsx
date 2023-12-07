// ShadCn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
import { SignatureFont } from "@/types";

type SignatureFontSelectorProps = {
    typedSignatureFonts: SignatureFont[];
    selectedFont: SignatureFont;
    setSelectedFont: (value: SignatureFont) => void;
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
                defaultValue={
                    selectedFont.variable ?? typedSignatureFonts[0].variable
                }
                onValueChange={(fontVariable) => {
                    // Find the selected font object based on the variable
                    const selectedFontObject = typedSignatureFonts.find(
                        (font) => font.variable === fontVariable
                    );

                    if (selectedFontObject) {
                        setSelectedFont(selectedFontObject);
                    }
                }}
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
                                fontFamily: selectedFont.variable,
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
