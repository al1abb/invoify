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

type UploadSignatureProps = {};

const UploadSignature = (props: UploadSignatureProps) => {
    return (
        <TabsContent value="upload">
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password here. After saving, you'll be
                        logged out.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">Upload</CardContent>
                <CardFooter>
                    <BaseButton>Save password</BaseButton>
                </CardFooter>
            </Card>
        </TabsContent>
    );
};

export default UploadSignature;
