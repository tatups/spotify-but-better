import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import StackedLayout from "~/components/stacked-layout";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //dayjs();

  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <body className="h-full">
        <StackedLayout>{children}</StackedLayout>
      </body>
    </html>
  );
}
