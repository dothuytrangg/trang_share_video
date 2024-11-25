'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import requestApi from '../../../../helpers/api';
import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '@/stores/hookStore';
import { _GLOBAL } from '@/contstants';
import Image from 'next/image';
import Link from 'next/link';
import CustomCard from '@/util/customCard';
import { ReponsiveContainer } from '@/util/reponsiveUtil';

const Register = () => {
  const router = useRouter();
  const logo = '/image/logo.png';
  const [errorRegister, setErrorRegister] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [full_name, setName] = React.useState('');
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const masterStore = useAppSelector((state) => state.master);
  const [successRegister, setSuccessRegister] = React.useState('');

  const validateInputs = () => {
    let isValid = true;

    if (!full_name) {
      setNameError(true);
      setNameErrorMessage(t('name'));
      isValid = false;
    } else if (full_name.length < 3) {
      setNameError(true);
      setNameErrorMessage(t('name_least_3'));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!email) {
      setEmailError(true);
      setEmailErrorMessage(t('email_not_empty'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(t('email_invalid'));
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_not_empty'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_least_6'));
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default action

    const valid = validateInputs();

    if (valid) {
      const registerData = {
        full_name,
        email,
        password,
      };

      try {
        const res: any = await requestApi('auth/register', 'POST', registerData);

        if (res.success) {
          setSuccessRegister(t('register_success'));
          localStorage.setItem('userId', res.userId); // Store userId
          console.log('userId stored in localStorage:', res.userId);
          setTimeout(() => {
            router.replace(`/${masterStore.lang}/${_GLOBAL.ROUTE_SEND_OTP}`);
          }, 1000);
        } else if (res.errorCode === 'USER_EXISTS') {
          setSuccessRegister('');
          setErrorRegister(t('email_already_registered')); // Show error message for existing user
        } else {
          setErrorRegister(res.message); // Show other error messages if available
          setSuccessRegister('');
        }
      } catch (err: any) {
        console.error('Registration failed:', err.response?.data || err.message);
        setErrorRegister(t('registration_failed')); // Show a generic error message in case of failure
      }
    }
  };


  const renderRegister = () => {
    if (masterStore.isAuth) {
      router.replace(`/${locale}`);
    } else {
      return (
        <ReponsiveContainer direction="column" justifyContent="space-between">
          <Stack
            sx={{
              justifyContent: "center",
              height: "90dvh",
              p: 1,
            }}
          >
            <CustomCard variant="outlined">
              <Image src={logo} alt='author' width={50} height={50} />
              <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                {t('register')}
              </Typography>
              <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                  <FormLabel htmlFor="full_name">{t('input_name')}</FormLabel>
                  <TextField
                    fullWidth
                    id="full_name"
                    placeholder="Jon Snow"
                    value={full_name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameErrorMessage}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    fullWidth
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailErrorMessage(''); // Clear error message when user changes input
                    }}
                    error={emailError}
                    helperText={emailErrorMessage} // Display error message
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password">{t('password')}</FormLabel>
                  <TextField
                    fullWidth
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordErrorMessage(''); // Clear error message
                    }}
                    error={passwordError}
                    helperText={passwordErrorMessage}
                  />
                </FormControl>

                {/* Conditionally render error/success messages */}
                {errorRegister && <p className="text-red-600 text-center">{errorRegister}</p>}
                {successRegister && <p className="text-black-600 text-center">{successRegister}</p>}

                <Button type="submit" fullWidth variant="contained">
                  {t('register')}
                </Button>

                <Typography sx={{ textAlign: 'center' }}>
                  {(t('have_account'))}{' '}
                  <Link href={`/${locale}/${_GLOBAL.ROUTER_LOGIN}`} className="text-blue-600 underline">
                    {t('login')}
                  </Link>
                </Typography>
              </Box>
            </CustomCard>
          </Stack>
        </ReponsiveContainer>
      );
    }
  };

  return renderRegister();
};

export default Register;
