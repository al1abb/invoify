"use client";

import { useState } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
import { LanguageSelector, ThemeSwitcher } from "@/app/components";
import { SettingsPanel } from "@/app/components/settings/SettingsPanel";

// Icons
import { Settings } from "lucide-react";

const BaseNavbar = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <header className="lg:container z-[99]">
                <nav>
                    <Card className="flex flex-wrap justify-between items-center px-5 gap-5">
                        <Link href={"/"}>
                            <Image
                                src={Logo}
                                alt="Invoify Logo"
                                width={190}
                                height={100}
                                loading="eager"
                                style={{ height: "auto" }}
                            />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSettingsOpen(true)}
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                            <LanguageSelector />
                            <ThemeSwitcher />
                        </div>
                    </Card>
                </nav>
            </header>
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default BaseNavbar;
