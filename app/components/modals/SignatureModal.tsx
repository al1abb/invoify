"use client";

import React, { useEffect, useState } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Signature canvas
import SignatureCanvas from "react-signature-canvas";

// Shadcn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Check, Eraser } from "lucide-react";

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
        typedSignatureFontSize,
    } = useSignature();

    const signature = useWatch({
        name: "details.signature",
    });

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
                                className="border rounded-lg hover:border-blue-500"
                                src={signatureData}
                                width={300}
                                alt=""
                            />
                        ) : (
                            <canvas
                                style={{ backgroundColor: "#efefef" }}
                                className="border rounded-md hover:border-blue-500"
                                width={300}
                                height="auto"
                            ></canvas>
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
                        <TabsContent value="draw">
                            <Card className="border-none shadow-none">
                                <CardContent className="space-y-2 p-0">
                                    <div
                                        style={{
                                            width: "100%",
                                            maxWidth: "600px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <SignatureCanvas
                                            velocityFilterWeight={1} // Adjust the velocityFilterWeight to make the pen lighter
                                            minWidth={1.4} // Adjust the minWidth for a finer line
                                            maxWidth={1.4} // Adjust the maxWidth for a finer line
                                            throttle={0}
                                            ref={signatureRef}
                                            penColor={selectedColor}
                                            canvasProps={{
                                                style: {
                                                    background: "#efefef",
                                                    borderRadius: "10px",
                                                    width: "100%",
                                                    height: "15rem",
                                                },
                                            }}
                                            onEnd={handleCanvasEnd}
                                        />
                                    </div>
                                </CardContent>
                                <div className="flex justify-between gap-2 pt-2">
                                    <div className="flex gap-2">
                                        {colors.map((color) => (
                                            <BaseButton
                                                key={color.name}
                                                size="icon"
                                                tooltipLabel={color.label}
                                                style={{
                                                    backgroundColor:
                                                        color.color,
                                                }}
                                                className="flex justify-center items-center h-6 w-6 rounded-full"
                                                onClick={() =>
                                                    handleColorButtonClick(
                                                        color.name
                                                    )
                                                }
                                            >
                                                {selectedColor ===
                                                    color.name && (
                                                    <span className="text-white">
                                                        <Check size={16} />
                                                    </span>
                                                )}
                                            </BaseButton>
                                        ))}
                                    </div>

                                    {signatureData && (
                                        <BaseButton
                                            tooltipLabel="Clear the signature board"
                                            variant="outline"
                                            className="w-fit gap-2"
                                            onClick={clearSignature}
                                        >
                                            <Eraser />
                                            Erase
                                        </BaseButton>
                                    )}
                                    <BaseButton
                                        tooltipLabel="Save changes"
                                        disabled={!signatureData}
                                        onClick={handleSaveSignature}
                                    >
                                        Save
                                    </BaseButton>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* TYPE */}
                        <TabsContent value="type">
                            <Card className="border-none shadow-none">
                                <CardContent className="space-y-2 p-0">
                                    <div
                                        style={{
                                            width: "100%",
                                            maxWidth: "600px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <div className="relative">
                                            <canvas
                                                style={{
                                                    background: "#efefef",
                                                    borderRadius: "10px",
                                                    width: "100%",
                                                    height: "15rem",
                                                }}
                                            ></canvas>
                                            <Input
                                                className="absolute top-0 left-0 z-10 bg-transparent h-full w-full mx-auto text-center"
                                                style={{
                                                    fontSize: `${typedSignatureFontSize}px`,
                                                }}
                                                type="text"
                                                value={typedSignature}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setTypedSignature(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="flex justify-end gap-2 pt-2">
                                    <BaseButton
                                        tooltipLabel="Save changes"
                                        disabled={!typedSignature}
                                        onClick={handleSaveSignature}
                                    >
                                        Save
                                    </BaseButton>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* UPLOAD */}
                        <TabsContent value="upload">
                            <Card className="border-none shadow-none">
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving,
                                        you'll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    Upload
                                </CardContent>
                                <CardFooter>
                                    <BaseButton>Save password</BaseButton>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SignatureModal;
