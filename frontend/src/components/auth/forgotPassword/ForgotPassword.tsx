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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Email submitted:', email); // Debugging line
    requestApi('auth/forgot-password', 'POST', { email })
      .then((res: any) => {
        if (res.success) {
          setMessage('Password reset link sent! Please check your email.');
        } else if (res.message && res.message.includes('No account associated')) {
          setErrorMessage('No account associated with this email address.');
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
            Khôi phục mật khẩu
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                type="email"
                variant="outlined"
                fullWidth
                required
                value={email} // Bind the email state here
                onChange={(e) => setEmail(e.target.value)} // Update state on change
              />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" fullWidth>
              Gửi yêu cầu
            </Button>
          </Box>
          {message && <Typography color="error">{message}</Typography>} {/* Display message */}
        </CustomCard>
      </Stack>
    </ReponsiveContainer>
  );
};
export default ForgotPassword;