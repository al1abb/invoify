"use client";

import React, { useEffect, useRef, useState } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Shadcn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Components
import {
    BaseButton,
    DrawSignature,
    TypeSignature,
    UploadSignature,
} from "@/app/components";

// Icons
import { FileSignature } from "lucide-react";

// Hooks
import { useSignature } from "@/app/hooks/useSignature";

type SignatureModalProps = {};

const SignatureModal = (props: SignatureModalProps) => {
    const { setValue } = useFormContext();

    // Modal state
    const [open, setOpen] = useState(false);

    // Modal tabs
    const [tab, setTab] = useState("draw");

    const onTabChange = (value: string) => {
        setTab(value);
    };

    // Signature variables
    const {
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
    } = useSignature();

    const signature = useWatch({
        name: "details.signature",
    });

    const typedSignatureRef = useRef<HTMLInputElement | null>(null);

    /**
     * Function that handles signature save logic for all tabs (draw, type, upload)
     */
    const handleSaveSignature = () => {
        if (tab == "draw") {
            handleCanvasEnd();

            // This setValue was removed from handleCanvasEnd and put here to prevent
            // the signature from showing updated drawing every time drawing stops
            setValue("details.signature", signatureData, { shouldDirty: true });
            setOpen(false);
        }

        if (tab == "type") {
            setValue("details.signature", typedSignature, {
                shouldDirty: true,
            });

            setOpen(false);
        }
    };

    // When opening modal or switching tabs, apply signatureData to the canvas when it's available
    // Persists the signature
    useEffect(() => {
        if (open && signatureData) {
            // Access the canvas element and draw the signature
            setTimeout(() => {
                const canvas = signatureRef.current;
                if (canvas) {
                    canvas.fromDataURL(signatureData);
                }
            }, 50);
        }
    }, [open, tab]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex justify-start">
                    <div>
                        <Label>Signature</Label>

                        {signatureData && signature ? (
                            <img
                                className="border border-black rounded-md hover:border-blue-500"
                                src={signatureData}
                                width={300}
                                alt=""
                            />
                        ) : typedSignature ? (
                            <div className="flex justify-center items-center w-[300px]">
                                <p
                                    style={{
                                        fontFamily: selectedFont,
                                        fontSize: 55,
                                    }}
                                >
                                    {typedSignature}
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    backgroundColor: "#efefef",
                                    width: "300px",
                                }}
                                className="flex flex-col justify-center items-center h-[155px] border border-black rounded-md hover:border-blue-500"
                            >
                                <FileSignature />
                                <Label>Click to add signature</Label>
                            </div>
                        )}
                    </div>
                </DialogTrigger>

                <DialogContent className="select-none">
                    <DialogTitle>Signature</DialogTitle>

                    <Tabs value={tab} onValueChange={onTabChange}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="draw">Draw</TabsTrigger>
                            <TabsTrigger value="type">Type</TabsTrigger>
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                        </TabsList>

                        {/* DRAW */}
                        <DrawSignature
                            signatureData={signatureData}
                            signatureRef={signatureRef}
                            colors={colors}
                            selectedColor={selectedColor}
                            handleColorButtonClick={handleColorButtonClick}
                            clearSignature={clearSignature}
                            handleCanvasEnd={handleCanvasEnd}
                            handleSaveSignature={handleSaveSignature}
                        />

                        {/* TYPE */}
                        <TypeSignature
                            typedSignatureFontSize={typedSignatureFontSize}
                            selectedFont={selectedFont}
                            setSelectedFont={setSelectedFont}
                            typedSignature={typedSignature}
                            setTypedSignature={setTypedSignature}
                            typedSignatureFonts={typedSignatureFonts}
                            handleSaveSignature={handleSaveSignature}
                            inputRef={typedSignatureRef}
                        />

                        {/* UPLOAD */}
                        <UploadSignature />
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SignatureModal;
