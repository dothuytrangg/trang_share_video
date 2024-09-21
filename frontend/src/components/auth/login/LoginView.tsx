
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {
  ThemeProvider,
  createTheme,
  styled,

} from '@mui/material/styles';
import ForgotPassword from '@/components/auth/forgotPassword';

import { GoogleIcon, FacebookIcon, SitemarkIcon } from '@/components/auth/login/theme/CustomizeIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import requestApi from '../../../../helpers/api';
import { useAppDispatch, useAppSelector } from '@/stores/hookStore';
import { _GLOBAL } from '@/contstants';
import { loginSuccess, updateLocalStorage } from '@/stores/features/masterSlice';
import { useLocale, useTranslations } from 'next-intl';



// import NavBar from './NavBar';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'auto',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('sm')]: {
  },
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));



const LoginView = () => {
  const logo = '/image/logo.png';
  const router = useRouter();
  const masterStore = useAppSelector((state) => state.master);
  let [errorLogin, setErrorLogin] = React.useState('');
  const t = useTranslations("HomePage");
  const dispatch = useAppDispatch();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const locale = useLocale();









  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleLogin = (): void => {
    const valid: boolean = validateInputs();

    if (valid) {
      const loginData = { email, password }; // Login data to be sent to the API


      requestApi('auth/login', 'POST', loginData)
        .then((res: any) => {
          if (res.success) {

            setErrorLogin('');
            dispatch(loginSuccess({ ...res }))
            dispatch(updateLocalStorage())
            router.replace(`/${locale}`);
          } else {
            setErrorLogin(res.message)
          }
        })
        .catch((err: any) => {
          console.error('Login failed:', err.response?.data || err.message);
          // Handle login failure (e.g., show error message)
        });
    }
  };

  const renderLogin = () => {
    if (masterStore.isAuth) {
      router.replace(`/${locale}`)
    }else{
      return <SignInContainer direction="column" justifyContent="space-between">
      <Stack
        sx={{
          justifyContent: 'center',
          height: '100dvh',
          p: 2,
        }}
      >
        <Card variant="outlined">
          <Image src={logo} className='m-auto' alt="Picture of the author" width={50} height={50}></Image>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                value={email}
                onChange={(val) => { setEmail(val.target.value) }}
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>

              <TextField
                value={password}
                onChange={(val) => { setPassword(val.target.value) }}
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            {errorLogin != '' && (<p className='text-red-600 text-center'  >{errorLogin}</p>)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => handleLogin()}

            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <span >
                <Link
                  className="text-blue-600 underline"
                  href={`/${locale}/${_GLOBAL.ROUTER_REGISTER}`}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </SignInContainer>
    }
    
  }

  return renderLogin();
};

export default LoginView;