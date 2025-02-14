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
  title: "Youth Camp 2025",
  description: "Registration System for Youth Camp 2025",
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
              <Box sx={{ display: 'flex', width: '100%' }}>
                <SideBar isAuthenticated={!!token} />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'start',
                    width: '100%',
                    margin: '0 auto',
                    marginTop: '100px',
                    overflow: 'hidden',
                    gap: 2,
                    pl: 10,
                    pr: 10,
                    // marginLeft: { xs: 0, md: '350px' },
                    transition: 'margin-left 0.3s ease',
                    position: 'relative',
                    '& > *': {
                      maxWidth: '100%',
                      boxSizing: 'border-box'
                    }
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
