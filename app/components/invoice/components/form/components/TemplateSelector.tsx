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
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Components
import {
    BaseButton,
    InvoiceTemplate1,
    InvoiceTemplate2,
} from "@/app/components";

// Template images
import template1 from "@/public/assets/img/invoice-1-example.png";

// Types
import { InvoiceType } from "@/app/types/types";

type TemplateSelectorProps = {};

const TemplateSelector = ({}: TemplateSelectorProps) => {
    const { watch, setValue } = useFormContext<InvoiceType>();
    const formValues = watch();
    const templates = [
        {
            id: 1,
            name: "Template 1",
            description: "Template 1 description",
            img: template1,
            component: <InvoiceTemplate1 {...formValues} />,
        },
        {
            id: 2,
            name: "Template 2",
            description: "Second template",
            img: template1,
            component: <InvoiceTemplate2 {...formValues} />,
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
                                Select one of the predefined templates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="">
                            <div className="flex overflow-x-auto">
                                {templates.map((template, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col flex-shrink-0 mr-4 my-5 gap-y-3"
                                    >
                                        <p>{template.name}</p>

                                        <div className="border">
                                            <Image
                                                src={template.img}
                                                alt={template.name}
                                                width={300}
                                                height={700}
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
