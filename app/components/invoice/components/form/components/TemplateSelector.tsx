"use client";

import React from "react";

import Image from "next/image";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Template images
import template1 from "@/public/assets/img/invoice-1-example.png";

// Types
import { InvoiceType } from "@/app/types/types";

type TemplateSelectorProps = {};

const TemplateSelector = ({}: TemplateSelectorProps) => {
    const { setValue } = useFormContext<InvoiceType>();
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
            img: template1,
        },
    ];
    return (
        <>
            <div>
                <Label>Choose invoice template:</Label>

                <div>
                    <Card>
                        <CardHeader>
                            <p>Templates</p>
                            <CardDescription>
                                Select one of the templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="">
                            <div className="flex overflow-x-auto">
                                {templates.map((template, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col flex-shrink-0 mr-4"
                                    >
                                        <p>{template.name}</p>

                                        <div className="border">
                                            <Image
                                                src={template.img}
                                                alt={template.name}
                                                width={300}
                                                height={700}
                                            />
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
