"use client";

import React, { useState } from "react";

// ShadCn
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
import { Textarea } from "@/components/ui/textarea";

// Components
import { BaseButton } from "@/app/components";

// Helpers
import { isValidEmail } from "@/lib/helpers/client";
import { EmailMessageOptions } from "@/types";

type SendPdfToEmailModalProps = {
    sendPdfToMail: (
        email: string,
        messageOptions?: EmailMessageOptions
    ) => Promise<void>;
    children: React.ReactNode;
};

const SendPdfToEmailModal = ({
    sendPdfToMail,
    children,
}: SendPdfToEmailModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [footer, setFooter] = useState("");
    const [error, setError] = useState("");
    const errorMessage = "Please enter a valid email address";

    const handleSendPdf = () => {
        setLoading(true);

        if (isValidEmail(email)) {
            sendPdfToMail(email, {
                subject,
                body,
                footer,
            }).finally(() => {
                setError("");
                setLoading(false);
                setEmail("");
                setSubject("");
                setBody("");
                setFooter("");
                setOpen(false);
            });
        } else {
            setLoading(false);
            setError(errorMessage);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

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
                    data-testid="send-email-input"
                ></Input>

                <Label>Subject</Label>
                <Input
                    type="text"
                    placeholder="Invoice Ready"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    data-testid="send-email-subject-input"
                />

                <Label>Message</Label>
                <Textarea
                    placeholder="Optional custom message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    data-testid="send-email-body-input"
                />

                <Label>Signature / Footer</Label>
                <Textarea
                    placeholder="Optional signature, e.g. Ray Harrison"
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    data-testid="send-email-footer-input"
                />

                {!loading && error && (
                    <small style={{ color: "red" }}>{error}</small>
                )}

                <BaseButton
                    tooltipLabel="Send invoice PDF"
                    loading={loading}
                    loadingText="Sending email"
                    onClick={handleSendPdf}
                    data-testid="confirm-send-email-btn"
                >
                    Send PDF
                </BaseButton>
            </DialogContent>
        </Dialog>
    );
};

export default SendPdfToEmailModal;
