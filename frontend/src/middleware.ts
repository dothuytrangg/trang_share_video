import createMiddleware from 'next-intl/middleware';
import { _GLOBAL } from './contstants';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vn'],
 
  // Used when no locale matches
  defaultLocale: _GLOBAL.DEFAULT_LANG
});

// export function middleware(request: NextRequest) {
//   console.log(request)
//   return  NextResponse.next()
//   // return NextResponse.redirect(new URL('/home', request.url))
// }
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vn|en)/:path*']
};