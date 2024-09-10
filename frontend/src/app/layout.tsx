import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "./globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
const inter = Inter({ subsets: ["latin"] });
import StoreProvider from "../stores/providers";
import Theme from "../theme";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";

export const metadata: Metadata = {
  title: "TUN STUDIO",
  description: "TRANG UYEN",
  icons :{
    icon: '/image/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("theme: ", theme);
  return (
    <html lang="en">
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
    </html>
  );
}
