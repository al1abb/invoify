import { DevDebug, ThemeSwitcher } from "@/app/components";
import { Card } from "@/components/ui/card";
import Logo from "@/public/assets/img/invoizer-logo.svg";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

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
            {/* TODO: should we show badge? */}
            {/* <Badge variant="outline" className="text-xs">v{packageInfo.version}</Badge> */}
          </div>
          <div className="flex items-center gap-3">
            {/* ? DEV Only */}
            {devEnv && <DevDebug />}
            {/* TODO: Make i18n work */}
            {/* <LanguageSelector /> */}

            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <ThemeSwitcher />
          </div>
        </Card>
      </nav>
    </header>
  );
};

export default BaseNavbar;
