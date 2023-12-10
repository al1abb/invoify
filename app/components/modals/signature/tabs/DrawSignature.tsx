"use client";

// React Signature Canvas
import SignatureCanvas from "react-signature-canvas";

// ShadCn
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton, SignatureColorSelector } from "@/app/components";

// Contexts
import { useSignatureContext } from "@/contexts/SignatureContext";

// Icons
import { Check, Eraser } from "lucide-react";

// Types
import { SignatureTabs } from "@/types";

type DrawSignatureProps = {
    handleSaveSignature: () => void;
};

const DrawSignature = ({ handleSaveSignature }: DrawSignatureProps) => {
    const {
        signatureData,
        signatureRef,
        colors,
        selectedColor,
        handleColorButtonClick,
        clearSignature,
        handleCanvasEnd,
    } = useSignatureContext();

    return (
        <TabsContent value={SignatureTabs.DRAW}>
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        {/* Signature Canvas to draw signature */}
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
                    {/* Color selector */}
                    <SignatureColorSelector
                        colors={colors}
                        selectedColor={selectedColor}
                        handleColorButtonClick={handleColorButtonClick}
                    />

                    {signatureData && (
                        <BaseButton
                            tooltipLabel="Clear the signature board"
                            variant="outline"
                            className="w-fit gap-2"
                            onClick={clearSignature}
                        >
                            Erase
                            <Eraser />
                        </BaseButton>
                    )}
                    <BaseButton
                        tooltipLabel="Save changes"
                        disabled={!signatureData}
                        onClick={handleSaveSignature}
                    >
                        Done
                        <Check />
                    </BaseButton>
                </div>
            </Card>
        </TabsContent>
    );
};

export default DrawSignature;
