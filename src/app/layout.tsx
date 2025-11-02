import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'PhaseWise',
  description: 'PhaseWise Project Tracker',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Toaster />
            {/* <Sidebar isOpen={true}/> */}
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
