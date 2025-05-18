import { ReactNode } from "react";
import "@/app/globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" className={outfit.className}>
            <body>{children}</body>
        </html>
    );
}
