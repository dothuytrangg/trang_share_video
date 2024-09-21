import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import secureLocalStorage from "react-secure-storage";
import { _GLOBAL } from "./contstants";
import { cookies } from "next/headers";

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

  return intlMiddleware(req);
  // const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";
  // // const detailRouterSecure = "^(/(" + locales.join("|") + "))?/detail/?.*?$";

  // const publicPathnameRegex = RegExp(excludePattern, "i");

  // const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname);
  // // const detailRouterSecureCheck = !detailRouterSecure.test(req.nextUrl.pathname);
  // let localAuthen:any = secureLocalStorage.getItem("master") as string;
  // console.log('typeof window', typeof window !== 'undefined');
  // if (typeof window !== 'undefined') {
  //   const data = secureLocalStorage.getItem("master") as string;
  //   console.log('data: ', data);
  // }
  // console.log('localAuthen: ', localAuthen);
  // if (isPublicPage) {
  //   return intlMiddleware(req);
  // } else {
   
  //   if (localAuthen) {
  //     // let parseLocalAuthen = JSON.parse(localAuthen) as string;
  //     // console.log('publicPathnameRegex.test(req.nextUrl.pathname): ', publicPathnameRegex.test(req.nextUrl.pathname));
  //     // if (publicPathnameRegex.test(req.nextUrl.pathname)) {
  //     //   if (parseLocalAuthen.user.role == _GLOBAL.ROLE_ADMIN) {
  //     //     return intlMiddleware(req);
  //     //   }
  //     // } else {
  //     //   return NextResponse.redirect(new URL("/errors/permission", req.url));
  //     // }
  //   }else{
  //     console.log("teo",222)
  //     return NextResponse.redirect(new URL("/errors/permission", req.url));
  //   }
  // }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
