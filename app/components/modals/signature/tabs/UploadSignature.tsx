import React from "react";

// ShadCn
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useSignatureContext } from "@/app/contexts/SignatureContext";

// Icons
import { Trash2 } from "lucide-react";

// Types
import { SignatureTabs } from "@/app/types/types";

type UploadSignatureProps = {
    handleSaveSignature: () => void;
};

const UploadSignature = ({ handleSaveSignature }: UploadSignatureProps) => {
    const {
        uploadSignatureRef,
        uploadSignatureImg,
        handleUploadSignatureChange,
        handleRemoveUploadedSignature,
    } = useSignatureContext();

    return (
        <TabsContent value={SignatureTabs.UPLOAD}>
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div style={{ height: "15rem" }}>
                        {uploadSignatureImg ? (
                            <img
                                style={{
                                    borderRadius: "10px",
                                    width: "100%",
                                    height: "15rem",
                                }}
                                width={300}
                                src={uploadSignatureImg}
                            />
                        ) : (
                            <div>Upload image</div>
                        )}
                        {/* Upload file here */}
                        <input
                            ref={uploadSignatureRef}
                            type="file"
                            onChange={handleUploadSignatureChange}
                            accept="image/*"
                        />
                    </div>
                </CardContent>
                <div className="flex justify-end gap-2 pt-2">
                    {/* Buttons and operations */}
                    {uploadSignatureImg && (
                        <BaseButton
                            tooltipLabel="Remove signature image"
                            variant="outline"
                            onClick={handleRemoveUploadedSignature}
                        >
                            <Trash2 />
                            Remove
                        </BaseButton>
                    )}
                    <BaseButton
                        tooltipLabel="Save changes"
                        disabled={!uploadSignatureImg}
                        onClick={handleSaveSignature}
                    >
                        Save
                    </BaseButton>
                </div>
            </Card>
        </TabsContent>
    );
};

export default UploadSignature;
