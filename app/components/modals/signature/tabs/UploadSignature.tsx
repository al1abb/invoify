import React from "react";

// ShadCn
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Trash2 } from "lucide-react";

type UploadSignatureProps = {
    uploadSignatureRef: React.RefObject<HTMLInputElement>;
    uploadSignatureImg: string;
    handleUploadSignatureChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handleRemoveUpload: () => void;
    handleSaveSignature: () => void;
};

const UploadSignature = ({
    uploadSignatureRef,
    uploadSignatureImg,
    handleUploadSignatureChange,
    handleRemoveUpload,
    handleSaveSignature,
}: UploadSignatureProps) => {
    return (
        <TabsContent value="upload">
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
                            onClick={handleRemoveUpload}
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
