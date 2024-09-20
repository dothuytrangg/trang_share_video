import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const locales = ["en", "vn"] as const;

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "vn",
  localeDetection: false,
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/",
    },
  }
);

export default function middleware(req: NextRequest) {
  const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";

  const publicPathnameRegex = RegExp(excludePattern, "i");

  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return NextResponse.redirect(new URL('/errors/permission', req.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};