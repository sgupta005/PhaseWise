import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Mentra BU',
  description: 'Mentra BU',
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
          <Toaster />
          {/* <Sidebar isOpen={true}/> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
