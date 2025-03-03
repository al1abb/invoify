import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

import { LOCALES, DEFAULT_LOCALE } from "@/lib/variables";
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES.map((locale) => locale.code),
 
  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);