"use client";

import { useEffect } from "react";

import Image from "next/image";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Template images
import template1 from "@/public/assets/img/invoice-1-example.png";
import template2 from "@/public/assets/img/invoice-2-example.png";

// Icons
import { Check } from "lucide-react";

// Types
import { InvoiceType } from "@/types";
import { updateUserPreferences } from "@/lib/storage/userPreferences";

const TemplateSelector = () => {
    const { control, setValue } = useFormContext<InvoiceType>();
    const selectedTemplateId = useWatch({
        control,
        name: "details.pdfTemplate",
    });

    useEffect(() => {
        if (!selectedTemplateId) return;
        updateUserPreferences({
            defaultTemplateId: selectedTemplateId,
        });
    }, [selectedTemplateId]);

    const templates = [
        {
            id: 1,
            name: "Template 1",
            description: "Template 1 description",
            img: template1,
        },
        {
            id: 2,
            name: "Template 2",
            description: "Second template",
            img: template2,
        },
    ];
    return (
        <>
            <div>
                <Label>Choose Invoice Template:</Label>

                <div>
                    <Card>
                        <CardHeader>
                            Templates
                            <CardDescription>
                                Select one of the predefined templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="">
                            <div className="flex overflow-x-auto">
                                {templates.map((template, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col flex-shrink-0 mr-4 gap-y-3"
                                    >
                                        <p>{template.name}</p>

                                        <div className="relative">
                                            {selectedTemplateId === template.id && (
                                                <div className="shadow-lg absolute right-2 top-2 rounded-full bg-blue-300 dark:bg-blue-600">
                                                    <Check />
                                                </div>
                                            )}
                                            <Image
                                                src={template.img}
                                                alt={template.name}
                                                width={300}
                                                height={700}
                                                placeholder="blur"
                                                className="cursor-pointer rounded-lg border-2 hover:border-blue-600"
                                                onClick={() =>
                                                    setValue(
                                                        "details.pdfTemplate",
                                                        template.id
                                                    )
                                                }
                                            />
                                            {/* {template.component} */}
                                        </div>

                                        <BaseButton
                                            onClick={() =>
                                                setValue(
                                                    "details.pdfTemplate",
                                                    template.id
                                                )
                                            }
                                        >
                                            Select
                                        </BaseButton>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default TemplateSelector;
