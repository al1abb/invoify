import { ReactNode } from "react";
import "@/app/globals.css";
import {
  outfit,
  dancingScript,
  greatVibes,
  alexBrush,
  parisienne,
} from "@/lib/fonts";

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased bg-slate-100 dark:bg-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
