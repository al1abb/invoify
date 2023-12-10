"use client";

import React, {
    MutableRefObject,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Signature Canvas
import SignatureCanvas from "react-signature-canvas";

// Variables
import { SIGNATURE_COLORS, SIGNATURE_FONTS } from "@/lib/variables";

// Types
import { SignatureColor, SignatureFont } from "@/types";

const defaultSignatureContext = {
    signatureData: "",
    signatureRef: null as MutableRefObject<SignatureCanvas | null> | null,
    colors: [] as SignatureColor[],
    selectedColor: "",
    handleColorButtonClick: (color: string) => {},
    clearSignature: () => {},
    handleCanvasEnd: () => {},
    typedSignature: "",
    setTypedSignature: (value: string) => {},
    typedSignatureRef: null as MutableRefObject<HTMLInputElement | null> | null,
    typedSignatureFonts: [] as SignatureFont[],
    selectedFont: {} as SignatureFont,
    setSelectedFont: (value: SignatureFont) => {},
    typedSignatureFontSize: 0 as number,
    clearTypedSignature: () => {},
    uploadSignatureRef:
        null as MutableRefObject<HTMLInputElement | null> | null,
    uploadSignatureImg: "",
    handleUploadSignatureChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
    handleRemoveUploadedSignature: () => {},
};

export const SignatureContext = createContext(defaultSignatureContext);

export const useSignatureContext = () => {
    return useContext(SignatureContext);
};

type SignatureContextProviderProps = {
    children: React.ReactNode;
};

export const SignatureContextProvider = ({
    children,
}: SignatureContextProviderProps) => {
    // Form context
    const { setValue } = useFormContext();

    const signature = useWatch({
        name: "details.signature.data",
    });

    /**
     * * DRAWING SIGNATURE
     */

    // Signature in base64 or as string
    const [signatureData, setSignatureData] = useState(signature ?? "");

    // Signature
    const signatureRef = useRef<SignatureCanvas | null>(null);

    // Colors
    const colors: SignatureColor[] = SIGNATURE_COLORS;
    const [selectedColor, setSelectedColor] = useState<string>(colors[0].color);

    /**
     * Sets selected signature color
     *
     * @param {string} color - Color to be selected as string. Ex: "red"
     */
    const handleColorButtonClick = (color: string) => {
        setSelectedColor(color);
    };

    /**
     * Clears drawn signature canvas
     */
    const clearSignature = useCallback(() => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setSignatureData("");
            setValue("details.signature", "");
        }
    }, []);

    /**
     * Fires every time canvas drawing stops
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
    const [typedSignature, setTypedSignature] = useState<string>(
        signature ?? ""
    );

    // Typed signature input ref
    const typedSignatureRef = useRef<HTMLInputElement | null>(null);

    // All available fonts for typed signature input
    const typedSignatureFonts: SignatureFont[] = SIGNATURE_FONTS;

    const [selectedFont, setSelectedFont] = useState<SignatureFont>(
        typedSignatureFonts[0]
    );

    /**
     * Font size calculator for typed signature
     *
     * @param {string} text - Text in signature input
     * @returns {number} Font size that should be used
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
     * Clears typed signature
     */
    const clearTypedSignature = () => {
        setTypedSignature("");
        setValue("details.signature", "");
    };

    /**
     * * UPLOAD SIGNATURE
     */
    const uploadSignatureRef = useRef<HTMLInputElement | null>(null);
    const [uploadSignatureImg, setUploadSignatureImg] = useState<string>("");

    /**
     * Function that fires every time signature file input changes
     * @param e - Event object from file input
     */
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

    /**
     * Function that removes uploaded signature
     */
    const handleRemoveUploadedSignature = () => {
        setUploadSignatureImg("");

        if (uploadSignatureRef.current) {
            uploadSignatureRef.current.value = "";
        }
    };

    return (
        <SignatureContext.Provider
            value={{
                signatureData,
                signatureRef,
                colors,
                selectedColor,
                handleColorButtonClick,
                clearSignature,
                handleCanvasEnd,
                typedSignature,
                setTypedSignature,
                typedSignatureRef,
                typedSignatureFonts,
                selectedFont,
                setSelectedFont,
                typedSignatureFontSize,
                clearTypedSignature,
                uploadSignatureRef,
                uploadSignatureImg,
                handleUploadSignatureChange,
                handleRemoveUploadedSignature,
            }}
        >
            {children}
        </SignatureContext.Provider>
    );
};
