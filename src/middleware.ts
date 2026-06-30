import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - api routes
  // - admin dashboard (not localized)
  // - _next internals
  // - static files (those containing a dot, e.g. favicon.ico)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
