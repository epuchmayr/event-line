import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { ApolloWrapper } from '../lib/apollo-wrapper';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const inter = Inter({ subsets: ['latin'] });
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Eventline',
  description: 'Creating connections from moments in time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <body className={`${inter.className} ${outfit.variable}`}>
              <ApolloWrapper>{children}</ApolloWrapper>
            </body>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </html>
    </ClerkProvider>
  );
}
