import React from "react";

// ShadCn
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton, SignatureFontSelector } from "@/app/components";

// Contexts
import { useSignatureContext } from "@/contexts/SignatureContext";

// Icons
import { Check, Eraser } from "lucide-react";

// Types
import { SignatureTabs } from "@/types";

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
        clearTypedSignature,
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
                <div className="flex justify-between gap-2 pt-2">
                    <SignatureFontSelector
                        typedSignatureFonts={typedSignatureFonts}
                        selectedFont={selectedFont}
                        setSelectedFont={setSelectedFont}
                    />

                    {typedSignature && (
                        <BaseButton
                            tooltipLabel="Clear signature"
                            variant="outline"
                            onClick={clearTypedSignature}
                        >
                            Clear
                            <Eraser />
                        </BaseButton>
                    )}

                    <BaseButton
                        tooltipLabel="Save changes"
                        disabled={!typedSignature}
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

export default TypeSignature;
