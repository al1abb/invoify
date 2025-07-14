"use client";

import { useParams, useRouter, usePathname } from "next/navigation";

// Next Intl
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
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    // Get the current path and replace the locale segment
    const segments = pathname.split("/");
    // segments[0] is always '', segments[1] is the locale
    if (segments.length > 1) {
      segments[1] = lang;
      const newPath = segments.join("/");
      router.push(newPath);
    } else {
      // fallback: just go to /{lang}
      router.push(`/${lang}`);
    }
  };
  return (
    <Select
      value={params.locale?.toString() || "en"}
      onValueChange={(lang) => handleLanguageChange(lang)}
    >
      <SelectTrigger className="w-40 relative" aria-label="Languages">
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
