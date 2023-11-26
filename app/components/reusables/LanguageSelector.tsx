"use client";

import React from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next-intl/client";

// ShadCn
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Variables
import { LOCALES } from "@/lib/variables";

type LanguageSelectorProps = {};

const LanguageSelector = ({}: LanguageSelectorProps) => {
    const router = useRouter();
    const params = useParams();

    const handleLanguageChange = (lang: string) => {
        console.log(lang);

        router.push("/", { locale: lang });
    };
    return (
        <Select
            value={params.locale.toLocaleString()}
            onValueChange={(lang) => handleLanguageChange(lang)}
        >
            <SelectTrigger className="w-[10rem]">
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent
                style={{
                    overflowY: "hidden",
                    height: "min-content",
                }}
            >
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>

                    {LOCALES.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                            {locale.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
