"use client";

// Next Intl
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

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

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    console.log(lang);
    router.push("/", { locale: lang });
  };

  return (
    <Select
      value={pathname}
      onValueChange={(lang) => handleLanguageChange(lang)}
    >
      <SelectTrigger className="w-[10rem] relative" aria-label="Languages">
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
