import { _GLOBAL } from '@/contstants';
import { useLocale } from 'next-intl';
import { redirect } from 'next/navigation';
import SendOTP from '@/components/sendOTP';







export default function RootPage() {


  return redirect(`${_GLOBAL.DEFAULT_LANG}`);

}
