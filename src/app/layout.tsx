import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BudgetFlow - จัดการเงินอย่างชาญฉลาด",
  description: "แอปพลิเคชันจัดการรายรับรายจ่ายส่วนบุคคล ติดตามการใช้จ่ายและวางแผนการเงินได้ง่ายๆ",
  keywords: ["budget", "finance", "money", "expense", "income", "การเงิน", "รายรับ", "รายจ่าย"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0f0f1a" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
