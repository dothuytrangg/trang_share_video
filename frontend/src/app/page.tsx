import { _GLOBAL } from '@/contstants';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(`${_GLOBAL.DEFAULT_LANG}`);
}
