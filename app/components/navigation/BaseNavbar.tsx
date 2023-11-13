import React, { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <nav className="container flex flex-wrap gap-5 justify-between items-center py-5 px-10">
            <Link href={"/"}>
                <Image src={Logo} alt="Invoify Logo" width={200} height={150} />

                <p>Generate invoices with ease.</p>
            </Link>
            {/* ? DEV Only */}
            {devEnv && <DevDebug />}
            <LanguageSelector />
            <ThemeSwitcher />
        </nav>
    );
};

export default BaseNavbar;
