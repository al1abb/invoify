"use client";

import { GITHUB_LINK } from "../lib/constant";
import { Star } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-8 min-h-[80px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 justify-center">
          <img src="/icon.svg" className="w-10 h-10" alt="Icon" />
          <img
            src="/logo.svg"
            className="text-2xl font-bold text-[#101828]"
            width="200"
            height="36"
            alt="Receipt Hero"
          />
        </div>
      </div>
     
    </header>
  );
}
