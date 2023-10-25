import { BaseButton, SignatureFontSelector } from "@/app/components";
import { SignatureFont } from "@/app/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import React, { RefObject } from "react";

type TypeSignatureProps = {
    typedSignatureFontSize: number | string;
    selectedFont: SignatureFont;
    setSelectedFont: (value: SignatureFont) => void;
    typedSignature: string;
    setTypedSignature: (value: string) => void;
    typedSignatureFonts: SignatureFont[];
    handleSaveSignature: () => void;
    inputRef: RefObject<HTMLInputElement>;
};

const TypeSignature = ({
    typedSignatureFontSize,
    selectedFont,
    setSelectedFont,
    typedSignature,
    setTypedSignature,
    typedSignatureFonts,
    handleSaveSignature,
    inputRef,
}: TypeSignatureProps) => {
    return (
        <TabsContent value="type">
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div
                        className="flex justify-center items-center"
                        style={{ height: "15rem" }}
                    >
                        <Input
                            id="typed-signature"
                            ref={inputRef}
                            className="bg-transparent h-full text-center"
                            style={{
                                fontSize: `${typedSignatureFontSize}px`,
                                fontFamily: selectedFont.variable,
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
