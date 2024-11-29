"use client";
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import requestApi from '../../../../helpers/api';
import { ReponsiveContainer } from '@/util/reponsiveUtil';
import CustomCard from '@/util/customCard';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
    height: '100vh',
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    justifyContent: 'center',
}));

const ResetPassword = () => {
    const logo = '/image/logo.png';
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Retrieve token from URL

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const validatePassword = () => 
        {
            
        if (newPassword != confirmPassword) {
            setMessage('Mật khẩu không khớp');
            setError(true);
            return false;
        }
        if (newPassword.length < 6) {
            setMessage('Mật khẩu phải có ít nhất 6 ký tự');
            setError(true);
            return false;
        }
        setMessage('');
        setError(false);
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validatePassword()) {
            requestApi(`auth/reset-password/${token}`, "POST",{
                newPassword,
                newConfirmPassword: confirmPassword
            })
        .then((res: any) => {
          if (res.success) {
            setMessage('Mật khẩu đã được đổi thành công!');
            setError(false);
             router.push('/login'); // Redirect to login page after success
          } else {
            setMessage(res.data.message || 'Đã xảy ra lỗi!');
            setError(true);
          }
        })
        .catch((err: any) => {
            console.error(err);
            setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
            setError(true);
        });
        }
    };


    return (
        <ReponsiveContainer direction="column" justifyContent="center">
            <Stack
                sx={{
                    justifyContent: "center",
                    height: "90dvh",
                    p: 2,
                }}
            >
                <CustomCard variant="outlined">
                    <Image src={logo} alt="Company logo" width={50} height={50} />
                    <Typography component="h1" variant="h5" sx={{ gap:1, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
                        Đổi mật khẩu
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <FormControl>
                            <FormLabel htmlFor="new-password">Mật khẩu mới</FormLabel>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="confirm-password">Xác nhận mật khẩu</FormLabel>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Đổi mật khẩu
                        </Button>
                    </Box>
                    {message && <Typography color={error ? "error" : "success"} align="center" sx={{ mt: 2 }}>{message}</Typography>}
                </CustomCard>
            </Stack>
        </ReponsiveContainer>
    );
};

export default ResetPassword;