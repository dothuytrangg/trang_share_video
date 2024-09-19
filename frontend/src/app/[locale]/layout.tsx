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
import { initialBootState } from "@/stores/features/masterSlice";
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
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body suppressHydrationWarning={true} className={inter.className}>
          <StoreProvider>
            <Theme>
              <AppRouterCacheProvider>
                <CssBaseline />
                <Box sx={{ display: "flex" }}>
                  <Navbar></Navbar>
                  <Sidebar></Sidebar>
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
                    {children}
                  </Box>
                </Box>
              </AppRouterCacheProvider>
            </Theme>
          </StoreProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
