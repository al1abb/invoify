import React from "react";

// Shadcn
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// Components
import { BaseButton } from "@/app/components";

type UploadSignatureProps = {
    uploadSignatureRef: React.RefObject<HTMLInputElement>;
    uploadSignatureImg: string;
    handleUploadSignatureChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handleSaveSignature: () => void;
};

const UploadSignature = ({
    uploadSignatureRef,
    uploadSignatureImg,
    handleUploadSignatureChange,
    handleSaveSignature,
}: UploadSignatureProps) => {
    return (
        <TabsContent value="upload">
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
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
                <div className="flex justify-between gap-2 pt-2">
                    {/* Buttons and operations */}
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
