import { _GLOBAL } from '@/contstants';
import { useLocale } from 'next-intl';
import { redirect } from 'next/navigation';







export default function RootPage() {


  return redirect(`${_GLOBAL.DEFAULT_LANG}`);

}
