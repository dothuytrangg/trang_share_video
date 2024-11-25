"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import ForgotPassword from "@/components/auth/forgotPassword";

import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "@/components/auth/login/theme/CustomizeIcon";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import requestApi from "../../../../helpers/api";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { _GLOBAL } from "@/contstants";
import {
  loginSuccess,
  logout,
  updateLocalStorage,
} from "@/stores/features/masterSlice";
import { useLocale, useTranslations } from "next-intl";
import CustomCard from "@/util/customCard";
import { ReponsiveContainer } from "@/util/reponsiveUtil";

// import NavBar from './NavBar';


const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "auto",
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.up("sm")]: {},
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

const LoginView = () => {
  const logo = "/image/logo.png";
  const router = useRouter();
  const masterStore = useAppSelector((state) => state.master);
  let [errorLogin, setErrorLogin] = useState("");
  const t = useTranslations("HomePage");
  const dispatch = useAppDispatch();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [approve, setApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const locale = useLocale();
  const pathName = usePathname();
  const query = useSearchParams();
  var oneTime = false;
  useEffect(() => {
    if (!oneTime) {
      console.log('locale: ', locale);
      const action = query.get("action");
      if (action == "logout") {
        dispatch(logout());
        dispatch(updateLocalStorage());
        setApprove(true);
      } else if (!masterStore.isAuth) {
        setApprove(true)
      } else {
        console.log('locale: ', locale);
        router.push(`/${locale}`)
      }

      oneTime = true;
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value) {
      setEmailError(true);
      setEmailErrorMessage(t('email_not_empty'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage(t("email_invalid"));
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    //----------------------------password-----------------------------------------
    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_not_empty'));
      isValid = false;
    } else if (password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(t("password_least_6"));
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
      const loginData = { email, password };

      requestApi("auth/login", "POST", loginData)
        .then((res: any) => {
          if (res.success) {
            setErrorLogin(""); // Clear error message
            dispatch(loginSuccess({ ...res })); // Save user data to store
            dispatch(updateLocalStorage()); // Sync store with localStorage
            router.push(`/${locale}`); // Redirect to homepage
          } else {
            if (res.errorCode === "USER_NOT_FOUND") {
              setErrorLogin(t("user_not_found"));
            } else if (res.message === "Please verify your email before logging in.") {
              setErrorLogin(t("register_before_login"));
            } else if (res.message === "Password incorrect.") {
              setErrorLogin(t("password_incorrect"));
            } else {
              setErrorLogin(t("login_failed"));
            }
          }
        })
        .catch((err: any) => {
          console.error("Login failed:", err.response?.data || err.message);
          setErrorLogin(t("unexpected_error")); // Display generic error message
        });
    }
  };


  const renderLogin = () => {
    if (!approve) {

    } else {
      return (
        <ReponsiveContainer direction="column" justifyContent="space-between">
          <Stack
            sx={{
              justifyContent: "center",
              height: "90dvh",
              p: 2,
            }}
          >
            <CustomCard variant="outlined">
              <Image
                src={logo}
                alt="Picture of the author"
                width={50}
                height={50}
              ></Image>
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
              >
                {t('login')}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    value={email}
                    onChange={(val) => {
                      setEmail(val.target.value);
                    }}
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
                    color={emailError ? "error" : "primary"}
                    sx={{ ariaLabel: "email" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">{t('password')}</FormLabel>
                  {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
                  <TextField
                    value={password}
                    onChange={(val) => {
                      setPassword(val.target.value);
                    }}
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
                    color={passwordError ? "error" : "primary"}
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={() => handleLogin()}
                >
                  {t("login")}
                </Button>
                {errorLogin && (
                  <Typography
                    sx={{
                      color: "error.main",
                      textAlign: "center",
                      marginBottom: 2,
                    }}
                  >
                    {errorLogin}
                  </Typography>
                )}

                <Typography sx={{ textAlign: "center" }}>
                  {t('forgot_password')}
                  <span>
                    <Link
                      className="text-blue-600 underline"
                      href={`/${locale}/${_GLOBAL.ROUTER_FORGOT_PASSWORD}`}
                    >
                      {t('reset')}
                    </Link>
                  </span>
                </Typography>

                <Typography sx={{ textAlign: "center" }}>
                  {t('signin_login_question')}
                  <span>
                    <Link
                      className="text-blue-600 underline"
                      href={`/${locale}/${_GLOBAL.ROUTER_REGISTER}`}
                    >
                      {t('register')}
                    </Link>
                  </span>
                </Typography>
              </Box>
            </CustomCard>
          </Stack>
        </ReponsiveContainer>
      );
    }
  };

  return renderLogin();
};

export default LoginView;