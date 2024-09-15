import { _GLOBAL } from '@/contstants';
import { useAppSelector } from '@/stores/hookStore';
import { redirect } from 'next/navigation';

export default function RootPage() {
  // const masterStore = useAppSelector((state) => state.master);
  redirect(`${_GLOBAL.DEFAULT_LANG}`);
}
