import React from "react";

// ShadCn
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton, SignatureFontSelector } from "@/app/components";

// Contexts
import { useSignatureContext } from "@/app/contexts/SignatureContext";

// Types
import { SignatureTabs } from "@/app/types/types";

type TypeSignatureProps = {
    handleSaveSignature: () => void;
};

const TypeSignature = ({ handleSaveSignature }: TypeSignatureProps) => {
    const {
        typedSignatureFontSize,
        selectedFont,
        setSelectedFont,
        typedSignature,
        setTypedSignature,
        typedSignatureRef,
        typedSignatureFonts,
    } = useSignatureContext();

    return (
        <TabsContent value={SignatureTabs.TYPE}>
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div
                        className="flex justify-center items-center"
                        style={{ height: "15rem" }}
                    >
                        <Input
                            id="typed-signature"
                            ref={typedSignatureRef}
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
