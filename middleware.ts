import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/variables';

const SUPPORTED_LOCALES = LOCALES.map(locale => locale.code);

export function middleware(request: NextRequest) {
  // Vérifier si la request URL contient déjà une locale supportée
  const pathname = request.nextUrl.pathname;
  
  // Vérifier s'il s'agit d'un fichier statique ou une API
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Vérifier si l'URL commence déjà par une locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Rediriger vers la locale par défaut
  const locale = DEFAULT_LOCALE;
  
  // e.g. chez -> /fr/chez
  return NextResponse.redirect(
    new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    )
  );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
