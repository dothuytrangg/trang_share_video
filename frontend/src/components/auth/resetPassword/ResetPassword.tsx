"use client";
import React, { useState } from "react";
import { Box, Button, FormControl, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import requestApi from "../../../../helpers/api";
import { ReponsiveContainer } from "@/util/reponsiveUtil";
import CustomCard from "@/util/customCard";
import { useTranslations } from "next-intl";

const ResetPassword = () => {
    const logo = "/image/logo.png";
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const t = useTranslations("HomePage");

    const validatePassword = () => {
        let isValid = true;

        // Validate new password
        if (!newPassword) {
            setNewPasswordError(true);
            setNewPasswordErrorMessage(t("password_not_empty"));
            isValid = false;
        } else if (newPassword.length < 6) {
            setNewPasswordError(true);
            setNewPasswordErrorMessage(t("password_least_6"));
            isValid = false;
        } else if (newPassword.length > 16) {
            setNewPasswordError(true);
            setNewPasswordErrorMessage(t("password_most_16"));
            isValid = false;
        } else {
            setNewPasswordError(false);
            setNewPasswordErrorMessage("");
        }

        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage(t("confirm_password_not_empty"));
            isValid = false;
        } else if (confirmPassword !== newPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage(t("password_not_match"));
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validatePassword()) {
            try {
                const res: any = await requestApi(`auth/reset-password/${token}`, "POST", {
                    newPassword,
                    newConfirmPassword: confirmPassword,
                });

                if (res.success) {
                    setMessage(t("password_reset_success"));
                    setError(false);
                    router.push("/login");
                } else {
                    setMessage(res.data?.message || t("error_occurred"));
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setMessage(t("connection_error"));
                setError(true);
            }
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
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ gap: 1, fontSize: "clamp(1.5rem, 5vw, 2.25rem)" }}
                    >
                        {t("reset_password")}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
                    >
                        <FormControl >
                            <TextField
                                label={t("new_password")}
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={newPasswordError}
                                helperText={newPasswordErrorMessage}
                                autoComplete="new-password"
                                autoFocus
                                fullWidth
                                variant="outlined"
                                color={newPasswordError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl >
                            <TextField
                                label={t("confirm_password")}
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={confirmPasswordError}
                                helperText={confirmPasswordErrorMessage}
                                autoFocus
                                fullWidth
                                variant="outlined"
                                color={confirmPassword ? "error" : "primary"}
                            />
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {t("reset_password")}
                        </Button>
                    </Box>
                </CustomCard>
            </Stack>
        </ReponsiveContainer>
    );
};

export default ResetPassword;
