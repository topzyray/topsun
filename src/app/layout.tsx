import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { GlobalProvider } from "@/providers/global-state-provider";
import { envConfig } from "@/configs/env.config";
import Notification from "@/components/notification";
import QueryClientProvider from "../providers/query-client-provider";

const urbanist = Urbanist({ subsets: ["latin"] });

const schoolNameFull: string = envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL;
const schoolNameShort: string = envConfig.NEXT_PUBLIC_SCHOOL_NAME_SHORT;
const schoolDomain: string = envConfig.NEXT_PUBLIC_SCHOOL_DOMAIN;

export const metadata: Metadata = {
  title: `${schoolNameFull} - Smart School Management`,
  description: `School management system for ${schoolNameFull}. Automate student records, timetables, payments, and more.`,
  openGraph: {
    title: `${schoolNameFull} - Smart School Management`,
    description: `School management system for ${schoolNameFull}. Automate student records, timetables, payments, and more.`,
    url: `${schoolDomain}`,
    siteName: `${schoolNameFull}`,
    images: [
      {
        url: `${schoolDomain}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${schoolNameFull} Dashboard Screenshot`,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: `@${schoolNameShort}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  envConfig.validateConfig();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${urbanist.className} antialiased`}>
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <GlobalProvider>
                <main className="flex min-h-screen flex-col">{children}</main>
                <Notification />
              </GlobalProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
