// Next
import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";
import AuthControls from "@/app/components/reusables/AuthControls";

const BaseNavbar = () => {
    const devEnv = process.env.NODE_ENV === "development";

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
                            style={{ height: "auto" }}
                        />
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* ? DEV Only */}
                        {devEnv && <DevDebug />}
                        <AuthControls />
                        <LanguageSelector />
                        <ThemeSwitcher />
                    </div>
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
