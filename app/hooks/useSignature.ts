import { useState, useRef, useCallback, useMemo } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Signature Canvas
import SignatureCanvas from "react-signature-canvas";

// Types
import { SignatureColor, SignatureFont } from "@/app/types/types";

// Variables
import { SIGNATURE_COLORS, SIGNATURE_FONTS } from "@/lib/variables";

export function useSignature() {
    // Form context
    const { setValue } = useFormContext();

    /**
     * * DRAWING SIGNATURE
     */

    // Signature in base64 or as string
    const [signatureData, setSignatureData] = useState("");

    // Signature
    const signatureRef = useRef<SignatureCanvas | null>(null);

    // Colors
    const colors: SignatureColor[] = SIGNATURE_COLORS;
    const [selectedColor, setSelectedColor] = useState<string>(colors[0].color);

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

    // Value in typed input
    const [typedSignature, setTypedSignature] = useState<string>("");

    // All available fonts for typed signature input
    const typedSignatureFonts: SignatureFont[] = SIGNATURE_FONTS;

    const [selectedFont, setSelectedFont] = useState<SignatureFont>(
        typedSignatureFonts[0]
    );

    /**
     * Font size calculator for typed signature
     *
     * @param text Text in signature input
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

    /**
     * Memoized typed signature font size
     */
    const typedSignatureFontSize = useMemo(
        () => calculateFontSize(typedSignature),
        [typedSignature]
    );

    /**
     * * UPLOAD SIGNATURE
     */
    const uploadSignatureRef = useRef<HTMLInputElement | null>(null);
    const [uploadSignatureImg, setUploadSignatureImg] = useState<string>("");

    const handleUploadSignatureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files![0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target!.result as string;
                setUploadSignatureImg(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

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
        uploadSignatureRef,
        uploadSignatureImg,
        handleUploadSignatureChange,
    };
}
