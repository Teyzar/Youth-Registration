import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Providers } from "./providers";
import { Box } from "@mui/material";
import { cookies } from 'next/headers';
import SideBar from "@/components/layout/SideBar";
// import Footer from "@/components/layout/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get('token')?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary',
            }}
          >
            <Header isAuthenticated={!!token} />
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                position: 'relative',
              }}
            >
              <SideBar isAuthenticated={!!token} />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'start',
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto',
                  marginTop: '100px',
                  overflow: 'hidden'
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
