import { useState, useRef, useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";

// Signature Canvas
import SignatureCanvas from "react-signature-canvas";

export function useSignature() {
    const { setValue } = useFormContext();

    /**
     * * DRAWING SIGNATURE
     */

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

    /**
     * Function that sets selected color
     *
     * @param color Color to be selected as string. Ex: "red"
     */
    const handleColorButtonClick = (color: string) => {
        setSelectedColor(color);
    };

    /**
     * Function that clears drawn signature canvas
     */
    const clearSignature = useCallback(() => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setSignatureData("");
            setValue("details.signature", "");
        }
    }, []);

    /**
     * Function that fires every time canvas drawing stops
     */
    const handleCanvasEnd = useCallback(() => {
        if (signatureRef.current) {
            // Previously base64 was sent in parameter
            const dataUrl = signatureRef.current.toDataURL("image/png");
            setSignatureData(dataUrl);
        }
    }, []);

    /**
     * * TYPED SIGNATURE
     */

    const [typedSignature, setTypedSignature] = useState<string>("");

    const typedSignatureFonts = [
        {
            name: "Dancing Script",
            variable: "var(--font-dancing-script)",
        },
        { name: "Parisienne", variable: "var(--font-parisienne)" },
        {
            name: "Great Vibes",
            variable: "var(--font-great-vibes)",
        },
        {
            name: "Alex Brush",
            variable: "var(--font-alex-brush)",
        },
    ];
    const [selectedFont, setSelectedFont] = useState<string>(
        typedSignatureFonts[0].variable
    );

    /**
     * Font size calculator for typed signature
     *
     * @param text Text in signature input
     *
     * @returns Font size that should be used
     */
    const calculateFontSize = (text: string) => {
        const initialFontSize = 100;
        const canvasWidth = 300;
        let fontSize = initialFontSize;
        const textWidth = text.length * (initialFontSize / 2); // Adjust as needed for font width

        if (textWidth > canvasWidth - 20) {
            // Gradually decrease font size as text approaches canvas width
            fontSize = (canvasWidth - 20) / text.length / 0.4; // You can adjust the decrease rate
        }

        return fontSize;
    };

    const typedSignatureFontSize = useMemo(
        () => calculateFontSize(typedSignature),
        [typedSignature]
    );

    return {
        signatureData,
        signatureRef,
        colors,
        selectedColor,
        handleColorButtonClick,
        clearSignature,
        handleCanvasEnd,
        typedSignature,
        setTypedSignature,
        typedSignatureFonts,
        selectedFont,
        setSelectedFont,
        typedSignatureFontSize,
    };
}
