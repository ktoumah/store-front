"use client"

import localFont from "next/font/local";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppBar, Toolbar, Tabs, Tab, Container, Typography } from '@mui/material';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }, []);

  const handleTabChange = (event, newValue) => {
    router.push(newValue);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {token && (
          <AppBar position="static">
            <Container>
              <Toolbar disableGutters>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  STORE
                </Typography>
                <Tabs
                  value={pathname === "/account" ? "/account" : "/articles"}
                  onChange={handleTabChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                >
                  <Tab label="Account" value="/account" />
                  <Tab label="Articles" value="/articles" />
                </Tabs>
              </Toolbar>
            </Container>
          </AppBar>
        )}
        {children}
      </body>
    </html>
  );
}
