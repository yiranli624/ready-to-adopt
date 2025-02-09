import "./globals.css";
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-serif bg-stone-100'>
        <HeroUIProvider>
          <main className='flex flex-col min-h-screen'>
            <div className="flex-none h-60 bg-[url('/dog-adopt-banner.jpg')] bg-no-repeat bg-cover bg-center">
              <div className='flex flex-col h-full gap-4 px-20 justify-center text-amber-50 text-xl'>
                <p>ADOPTABLE DOGS</p>
                <p className='pl-30'>
                  Providing second chances for better lives.
                </p>
              </div>
            </div>
            {children}
          </main>
        </HeroUIProvider>
      </body>
    </html>
  );
}
