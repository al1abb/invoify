"use client";

import { GITHUB_LINK } from "@/lib/constant";
import { Star } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-2">
        {/* <div className="flex items-center gap-3 justify-center">
          <img src="/icon.svg" className="w-6 h-6" alt="Icon" />
          <img
            src="/logo.svg"
            className="text-lg font-semibold text-[#101828]"
            width="107"
            height="20"
            alt="Receipt Hero"
          />
        </div> */}
      </div>
     
    </header>
  );
}
