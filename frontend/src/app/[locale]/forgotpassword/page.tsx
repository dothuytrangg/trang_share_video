




import ForgotPassword from '@/components/auth/forgotPassword';
import LoginView from '@/components/auth/login/LoginView';
import { NextPage } from 'next';

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return <ForgotPassword />
};

export default Page;