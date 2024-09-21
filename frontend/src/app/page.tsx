import { _GLOBAL } from '@/contstants';
import { useLocale } from 'next-intl';
import { redirect, usePathname } from 'next/navigation';







export default function RootPage() {
  const locale = useLocale();
  const locales = ["en", "vn"] as const;
  const pathName = usePathname();
  const renderPage = () => {
console.log("11")
    const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";
    // const detailRouterSecure = "^(/(" + locales.join("|") + "))?/detail/?.*?$";

    const publicPathnameRegex = RegExp(excludePattern, "i");
    const isPublicPage = !publicPathnameRegex.test(pathName);
    console.log('isPublicPage: ', isPublicPage);

    return redirect(`${_GLOBAL.DEFAULT_LANG}`);


  }



  return renderPage();

}
