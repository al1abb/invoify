"use client";

import { usePathname } from "next/navigation";
import { BaseNavbar, BaseFooter } from "@/app/components";

const ConditionalNavbar = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    
    // Hide old navbar and footer for main page, templates page, and create-receipt page
    const hideOldNavbar = pathname === "/" || 
                         pathname === "/en" ||
                         pathname.includes("/templates") || 
                         pathname.includes("/create-receipt");

    if (hideOldNavbar) {
        return <>{children}</>;
    }

    return (
        <>
            <BaseNavbar />
            <div className="flex flex-col">{children}</div>
            <BaseFooter />
        </>
    );
};

export default ConditionalNavbar;