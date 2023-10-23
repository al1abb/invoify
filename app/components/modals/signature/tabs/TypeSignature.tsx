import { BaseButton, SignatureFontSelector } from "@/app/components";
import { SignatureFont } from "@/app/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

type TypeSignatureProps = {
    typedSignatureFontSize: number | string;
    selectedFont: string;
    setSelectedFont: (value: string) => void;
    typedSignature: string;
    setTypedSignature: (value: string) => void;
    typedSignatureFonts: SignatureFont[];
    handleSaveSignature: () => void;
};

const TypeSignature = ({
    typedSignatureFontSize,
    selectedFont,
    setSelectedFont,
    typedSignature,
    setTypedSignature,
    typedSignatureFonts,
    handleSaveSignature,
}: TypeSignatureProps) => {
    return (
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
                                className="absolute top-0 left-0 z-10 bg-transparent h-full w-full text-center"
                                style={{
                                    fontSize: `${typedSignatureFontSize}px`,
                                    fontFamily: selectedFont,
                                }}
                                type="text"
                                placeholder="Signature"
                                value={typedSignature}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setTypedSignature(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="flex justify-end gap-2 pt-2">
                    <SignatureFontSelector
                        typedSignatureFonts={typedSignatureFonts}
                        selectedFont={selectedFont}
                        setSelectedFont={setSelectedFont}
                    />
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
    );
};

export default TypeSignature;
