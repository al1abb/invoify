"use client";

import React, { useState } from "react";

// Shadcn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Mail } from "lucide-react";

type SendPdfToEmailModalProps = {
    sendPdfToMail: (email: string) => Promise<void>;
};

const SendPdfToEmailModal = ({ sendPdfToMail }: SendPdfToEmailModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSendPdf = () => {
        setLoading(true);

        sendPdfToMail(email).finally(() => {
            setLoading(false);
            setEmail("");
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <BaseButton tooltipLabel="Send invoice PDF to mail" size="icon">
                    <Mail />
                </BaseButton>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send to email</DialogTitle>
                    <DialogDescription>
                        Please specify the email address for invoice delivery.
                    </DialogDescription>
                </DialogHeader>
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Input>

                <BaseButton
                    tooltipLabel="Send invoice PDF"
                    loading={loading}
                    loadingText="Sending email"
                    onClick={handleSendPdf}
                >
                    Send PDF
                </BaseButton>
            </DialogContent>
        </Dialog>
    );
};

export default SendPdfToEmailModal;
