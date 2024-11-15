'use client';
import { useLocale, useTranslations } from "next-intl";
import HistoryIcon from '@mui/icons-material/History';
import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/hookStore"; // Hook Redux để lấy trạng thái đăng nhập
import Button from '@mui/material/Button';

const PlaylistHistory = () => {
    const router = useRouter();
    const t = useTranslations("HomePage");
    const locale = useLocale();
    const isLogin = useAppSelector((state) => state.master.is_login); // Kiểm tra trạng thái đăng nhập

    const handleLoginClick = () => {
        router.push('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    };

    return (
        <React.Fragment>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',  // Sắp xếp phần tử theo chiều dọc
                    justifyContent: 'center',  // Căn giữa theo chiều ngang
                    alignItems: 'center',      // Căn giữa theo chiều dọc
                    height: '100vh',           // Chiếm hết chiều cao của viewport
                    width: '100%',             // Đảm bảo chiều rộng chiếm hết
                    paddingBottom :"100px"
                }}
            >
                {isLogin ? (
                    <>
                        <h1>Lịch sử xem</h1>
                    </>
                ) : (
                    <>
                            <HistoryIcon style={{ fontSize: '4rem' }} />
                        <p>Please log in to view your playlist history.</p>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleLoginClick}
                        >
                            Đăng nhập
                        </Button>
                    </>
                )}
            </div>
        </React.Fragment>
    );
}

export default PlaylistHistory;
