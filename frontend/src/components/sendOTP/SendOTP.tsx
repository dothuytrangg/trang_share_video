'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { blue } from '@mui/material/colors';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    height: '70%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: '100vh',
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    justifyContent: 'center',
    ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

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
    const [otpError, setOtpError] = React.useState(true);
    const [otpErrorMessage, setOtpErrorMessage] = React.useState('');

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateOtp()) {
            router.push('/login');
            console.log('OTP Submitted:', otp);
            // Handle OTP submission
        } else {
            console.log('Invalid OTP');
        }
        
    };

    const validateOtp = () => {
        if (!otp || isNaN(Number(otp))) {
            setOtpError(true);
            setOtpErrorMessage('OTP cannot be empty.');
            return false;
        }
        else if (otp.length !== 6 ) {
            setOtpError(true);
            setOtpErrorMessage('OTP must be 6 digits.');
            return false;
        } else{
        setOtpError(false);
        setOtpErrorMessage('');
        return true;
        }
    };


    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Stack
                sx={{
                    justifyContent: 'center',
                    height: '100vh',
                    p: 2,
                }}
            >
                <Card variant="outlined">
                    <Image src={logo} alt="Company logo" width={50} height={50} />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Send OTP
                    </Typography>
                    <Typography
                        component="p"
                        variant="body2"
                        sx={{ width: '100%' }}
                    >We have sent a notification to your Email, please enter the code to continue.</Typography>

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
                            <FormLabel htmlFor="otp">Your OTP</FormLabel>
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
                        </FormControl>
                        <FormControl>
                            <p style={{ textAlign: "center" }}>Haven't received it yet?</p>
                            <a href= "" style={{ textAlign: "center", color: "blue" }}>
                                Receive again
                            </a>
                        </FormControl>
                        <Stack direction="row" spacing={2}>
                            <Button fullWidth variant="outlined" onClick={() => router.push('/')}>
                                Cancel
                            </Button>
                            <Button type="submit" fullWidth variant="contained" >
                                Submit OTP
                            </Button>
                        </Stack>
                    </Box>
                </Card>
            </Stack>
        </SignInContainer>
    );
};

export default SendOTP;
