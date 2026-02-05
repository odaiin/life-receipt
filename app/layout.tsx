import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFE RECEIPT STORE | 인간 영수증",
  description: "사주와 MBTI로 알아보는 나의 인생 영수증",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
