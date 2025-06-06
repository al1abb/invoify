"use client";

import { Badge } from "@/components/ui/badge";
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
// Next Intl
import { useRouter } from "next-intl/client"; // This useRouter is wrapped with next/navigation useRouter
import { useParams } from "next/navigation";

const LanguageSelector = () => {
    const router = useRouter();
    const params = useParams();

    const handleLanguageChange = (lang: string) => {
        console.log(lang);

        router.push("/", { locale: lang });
    };
    return (
        <Select
            value={params.locale!.toLocaleString()}
            onValueChange={(lang) => handleLanguageChange(lang)}
        >
            <SelectTrigger
                className="w-[10rem] relative"
                aria-label="Languages"
            >
                <Badge className="position: absolute -top-4 -left-2 font-normal">
                    BETA
                </Badge>
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
