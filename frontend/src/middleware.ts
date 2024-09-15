import createMiddleware from 'next-intl/middleware';
import { _GLOBAL } from './contstants';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vn'],
 
  // Used when no locale matches
  defaultLocale: _GLOBAL.DEFAULT_LANG
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vn|en)/:path*']
};