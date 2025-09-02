import Image from "next/image";
import { useMemo } from "react";
// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";
// ShadCn
import { Card } from "@/components/ui/card";
// Next i18n-aware Link
import { Link } from "@/i18n/navigation";
// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
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
                        />
                    </Link>
                    {/* ? DEV Only */}
                    {devEnv && <DevDebug />}
                    <LanguageSelector />
                    <ThemeSwitcher />
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
