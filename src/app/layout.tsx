import "./globals.css";
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-serif'>
        <HeroUIProvider>{children}</HeroUIProvider>
      </body>
    </html>
  );
}
