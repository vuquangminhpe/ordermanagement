import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import AppProvider from "@/components/app-provider";
import { Toaster } from "@/components/ui/sonner";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />

        <body>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AppProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
