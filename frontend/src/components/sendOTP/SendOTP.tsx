'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Button, InputBase, Link } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import requestApi from '../../../helpers/api';
import { ReponsiveContainer } from '@/util/reponsiveUtil';
import CustomCard from '@/util/customCard';
import { useLocale, useTranslations } from 'next-intl';
import { _GLOBAL } from '@/contstants';


// const Card = styled(MuiCard)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignSelf: 'center',
//     width: '100%',
//     height: '70%',
//     padding: theme.spacing(4),
//     gap: theme.spacing(2),
//     [theme.breakpoints.up('sm')]: {
//         width: '450px',
//     },
//     boxShadow:
//         'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//     height: '100vh',
//     backgroundImage:
//         'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     justifyContent: 'center',
//     ...theme.applyStyles('dark', {
//         backgroundImage:
//             'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
// }));

const OtpInput = styled(InputBase)(({ theme }) => ({
    width: '3rem',
    height: '3rem',
    margin: '0 0.5rem',
    fontSize: '2rem',
    textAlign: 'center',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    '&:focus': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
}));

const SendOTP = () => {
    const logo = '/image/logo.png';
    const router = useRouter();
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const [otpError, setOtpError] = useState(true);
    const [otpErrorMessage, setOtpErrorMessage] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
    const t = useTranslations("HomePage");
    const locale = useLocale();

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value.length === 1 && index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const validateOtp = () => {
        // Kiểm tra xem có bất kỳ ô OTP nào để trống
        if (otp.some(digit => digit === '')) {
            setOtpError(true);
            setOtpErrorMessage(t('otp_not_empty'));
            return false;
        }
        // Kiểm tra độ dài của OTP
        if (otp.length !== 6) {
            setOtpError(true);
            setOtpErrorMessage(t('otp_not_enough'));
            return false;
        } 
         else {
            setOtpError(false);
            setOtpErrorMessage('');
            return true;
        }
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        if (validateOtp()) {
            const otpCode = otp.join(''); // Kết hợp các chữ số OTP
            const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
            const parsedUserId = userId ? parseInt(userId, 10) : null; // Chuyển userId sang kiểu số nếu có

            // Kiểm tra nếu không có userId
            if (!parsedUserId) {
                setOtpError(true);
                setOtpErrorMessage("User ID is missing. Please try registering again.");
                return;
            }

            // Gửi OTP tới backend để xác minh
            requestApi('auth/verify-otp', 'POST', {
                userId: parsedUserId,
                token: otpCode, // OTP mà người dùng đã nhập
            })
                .then((res: any) => {
                    if (res.success) {
                        setOtpSuccessMessage("OTP verified successfully!");
                        localStorage.removeItem('userId'); // Xóa userId sau khi xác minh thành công
                        router.push('/login'); // Chuyển hướng tới trang đăng nhập
                    } else {
                        setOtpError(true);
                        setOtpErrorMessage(res.message || 'OTP verification failed');
                        setOtpSuccessMessage('');
                    }
                })
                .catch((error: any) => {
                    console.error('OTP verification failed:', error.response?.data || error.message);
                    setOtpError(true);
                    setOtpErrorMessage(error.response?.data.message || 'Verification failed');
                    setOtpSuccessMessage('');
                });
        }
    };

    const handleResendOtp = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsSendingOtp(true);

        try {
            const userId = localStorage.getItem('userId');
            await requestApi('auth/resend-otp', 'POST', { userId });
            alert("OTP has been resent!");
        } catch (error) {
            console.error("Error resending OTP:", error);
            alert("Failed to resend OTP. Please try again.");
        } finally {
            setIsSendingOtp(false);
        }
    };

    return (
        <ReponsiveContainer direction="column" justifyContent="center">
            <Stack
                sx={{
                    justifyContent: 'center',
                    height: '80vh',
                    p: 2,
                }}
            >
                <CustomCard variant="outlined">
                    <Image src={logo} alt="Company logo" width={50} height={50} />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                       {t('account_verified')}
                    </Typography>
                    <Typography
                        component="p"
                        variant="body2"
                        sx={{ width: '100%' }}
                    >{t('otp_notification_email')}</Typography>

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
                            <FormLabel htmlFor="otp">{t('otp')}</FormLabel>
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                {otp.map((digit, index) => (
                                    <OtpInput
                                        key={index}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                        inputRef={(el) => (otpInputRefs.current[index] = el)}
                                        inputProps={{
                                            maxLength: 1,
                                            type: 'text',
                                            pattern: '[0-9]*',
                                            inputMode: 'numeric',
                                        }}
                                    />
                                ))}
                            </Box>
                            {otpError && (
                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                    {otpErrorMessage}
                                </Typography>
                            )}
                            {otpSuccessMessage && !otpError && (
                                <Typography color="textPrimary" variant="caption" sx={{ mt: 1 }}>
                                    {otpSuccessMessage}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl>
                            <Typography sx={{ textAlign: 'center' }}>
                                {t('not_received_the_code')}{' '}
                                <Link href={`/${locale}/${_GLOBAL.ROUTER_LOGIN}`} className="text-blue-600 underline">
                                    {t('resend_otp')}
                                </Link>
                            </Typography>
                            {/* <Button
                                variant="text"
                                onClick={handleSubmit}
                                sx={{
                                    textAlign: "center",
                                    color: "blue",
                                    padding: 0,
                                    minWidth: 0,
                                    textDecoration: "underline",
                                }}
                            >
                                Receive again
                            </Button> */}
                        </FormControl>
                        <Stack direction="row" spacing={2}>
                            <Button fullWidth variant="outlined" onClick={() => router.push('/')}>
                                {t('btnCancel')}
                            </Button>
                            <Button type="submit" fullWidth variant="contained" >
                                {t('btnSubmitOtp')}
                            </Button>
                        </Stack>
                    </Box>
                </CustomCard>
            </Stack>
        </ReponsiveContainer>
    );
};

export default SendOTP;

