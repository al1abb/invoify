"use client";

import { useTheme } from "next-themes";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    return (
        <>
            <BaseButton
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </BaseButton>
        </>
    );
};

export default ThemeSwitcher;
