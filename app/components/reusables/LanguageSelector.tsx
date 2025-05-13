"use client";

import { useParams } from "next/navigation";

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
import { Badge } from "@/components/ui/badge";

// Variables
import { LOCALES } from "@/lib/variables";

const LanguageSelector = () => {
    const params = useParams<{ locale: string }>();
    
    const handleLanguageChange = (lang: string) => {
        console.log("Changing language to:", lang);
        
        // Get current path without locale prefix
        const pathname = window.location.pathname;
        const currentLocale = params.locale;
        
        // Replace current locale with new locale in path
        let newPath;
        if (pathname === `/${currentLocale}`) {
            // If we're at the root path for a locale
            newPath = `/${lang}`;
        } else {
            // Replace the locale in the path
            newPath = pathname.replace(`/${currentLocale}/`, `/${lang}/`);
        }
        
        // Navigate to new path
        window.location.href = newPath;
    };
    
    return (
        <Select
            value={params.locale}
            onValueChange={handleLanguageChange}
        >
            <SelectTrigger className="w-[8rem]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {LOCALES.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                            <div className="flex items-center gap-x-2">
                                {locale.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
