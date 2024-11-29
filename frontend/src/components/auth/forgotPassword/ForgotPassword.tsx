"use client";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { Box, TextField, Button, FormControl, FormLabel } from '@mui/material';
import React from 'react';
import requestApi from '../../../../helpers/api';
import router from 'next/router';
import { _GLOBAL } from '@/contstants';
import { ReponsiveContainer } from '@/util/reponsiveUtil';
import CustomCard from '@/util/customCard';
import { useTranslations } from 'next-intl';

// const ForgotPasswordContainer = styled(Stack)(({ theme }) => ({
//   height: '100%',
//   padding: 4,
//   backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
// }));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));


const ForgotPassword = () => {
  const logo = '/image/logo.png';
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const t = useTranslations("HomePage");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Email submitted:', email); // Debugging line
    requestApi('auth/forgot-password', 'POST', { email })
      .then((res: any) => {
        if (res.success) {
          setMessage(t('reset_notification_email'));
          setErrorMessage('');
        } else if (res.errorCode=== 'USER_NOT_FOUND') {
          setErrorMessage(t('user_not_found'));
        } else {
          setErrorMessage(res.message || 'Failed to send reset link.');
        }
      })
      .catch((err: any) => {
        console.error('Password reset request failed:', err.response?.data || err.message);
        setMessage('An error occurred. Please try again later.');
      });
  };

  return (
    <ReponsiveContainer direction="column" justifyContent="center">
      <Stack
        sx={{
          justifyContent: "center",
          height: "80dvh",
          p: 2,
        }}
      >
        <CustomCard variant="outlined">
          <Image src={logo} alt="author" width={50} height={50} />
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
            {t('reset_password')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            {t('input_your_email')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                value={email} // Bind the email state here
                onChange={(val) => {
                  setEmail(val.target.value);
                }}                
                type="email"
                variant="outlined"
                fullWidth
                required
               
              />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" fullWidth>
             {t('send_request')}
            </Button>
          </Box>
          {message && <Typography >{message}</Typography>} {/* Display message */}
          {errorMessage && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errorMessage}</Typography>} {/* Display error message */}
        </CustomCard>
      </Stack>
    </ReponsiveContainer>
  );
};
export default ForgotPassword;