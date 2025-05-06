import { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/invoizer-logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

// Get package version
import packageInfo from '../../../package.json';

const BaseNavbar = () => {
  const devEnv = useMemo(() => {
    return process.env.NODE_ENV === "development";
  }, []);

  return (
    <header className="lg:container z-[99]">
      <nav>
        <Card className="flex flex-wrap justify-between items-center px-5 gap-5">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <Image
                src={Logo}
                alt="Invoizer Logo"
                width={190}
                height={100}
                loading="eager"
              />
            </Link>
            <Badge variant="outline" className="text-xs">v{packageInfo.version}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* ? DEV Only */}
            {devEnv && <DevDebug />}
            {/* TODO: Make i18n work */}
            {/* <LanguageSelector /> */}
            <ThemeSwitcher />
          </div>
        </Card>
      </nav>
    </header>
  );
};

export default BaseNavbar;
