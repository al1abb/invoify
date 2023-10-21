import { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";

// Signature Canvas
import SignatureCanvas from "react-signature-canvas";

export function useSignature() {
    const { setValue } = useFormContext();

    // Signature in base64
    const [signatureData, setSignatureData] = useState("");

    // Signature
    const signatureRef = useRef<SignatureCanvas | null>(null);

    // Colors
    const colors = [
        { name: "black", label: "Black", color: "rgb(0, 0, 0)" },
        { name: "blue", label: "Blue", color: "rgb(0, 0, 255)" },
        {
            name: "red",
            label: "Red",
            color: "rgb(255, 0, 0)",
        },
    ];
    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);

    const handleColorButtonClick = (color: string) => {
        setSelectedColor(color);
    };

    const clearSignature = useCallback(() => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setSignatureData("");
            setValue("details.signature", "");
        }
    }, []);

    const handleCanvasEnd = useCallback(() => {
        if (signatureRef.current) {
            // Previously base64 was sent in parameter
            const dataUrl = signatureRef.current.toDataURL("image/png");
            setSignatureData(dataUrl);
        }
    }, []);

    return {
        signatureData,
        signatureRef,
        colors,
        selectedColor,
        handleColorButtonClick,
        clearSignature,
        handleCanvasEnd,
    };
}
