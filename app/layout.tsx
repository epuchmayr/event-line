import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';

import { ApolloWrapper } from '@/lib/apollo-wrapper';

import { ThemeProvider } from './ThemeProvider';

import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
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
      <html lang='en' suppressHydrationWarning>
        <body className={`${inter.className} ${outfit.variable}`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ApolloWrapper>
              <StoreProvider>{children}</StoreProvider>
            </ApolloWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
