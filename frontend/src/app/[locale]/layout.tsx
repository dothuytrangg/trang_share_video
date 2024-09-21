import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "./globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
const inter = Inter({ subsets: ["latin"] });
import StoreProvider from "../../stores/providers";
import Theme from "../../theme";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import LoginView from "@/components/auth/login";
import { useTranslations } from "next-intl";
import { NextIntlClientProvider, useMessages } from "next-intl";
import dynamic from 'next/dynamic'
import Header from '@/components/layouts/Header'
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "TUN STUDIO",
  description: "TRANG UYEN",
  icons: {
    icon: "/image/logo.png",
  },
};
export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: any;
  };
}) {
  const t = useTranslations("HomePage");
  const messages = useMessages();
  // console.log("theme: ", theme);
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body  suppressHydrationWarning={true} >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <Theme>
              <AppRouterCacheProvider>
                <CssBaseline />
                <Header >
                  {children}
                </Header>
              </AppRouterCacheProvider>
            </Theme>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
