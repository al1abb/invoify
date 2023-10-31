import React from "react";

import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// Components
import { DevDebug, ThemeSwitcher } from "@/app/components";

const BaseNavbar = () => {
    return (
        <nav className="container flex justify-between items-center py-5 px-10">
            <div>
                <Image src={Logo} alt="Invoify Logo" width={200} height={150} />

                <p>Generate invoices with ease.</p>
            </div>

            <div>
                <DevDebug />
            </div>

            <div>
                <ThemeSwitcher />
            </div>
        </nav>
    );
};

export default BaseNavbar;
