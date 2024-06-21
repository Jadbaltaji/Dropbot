import "./globals.css";
import { auth, ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import Link from "next/link";
import type { Metadata } from "next";
import NavBar from "@/app/NavBar";
import Providers from "@/app/providers";
import { ClerkButton, PointsCounter } from "@/components";
import { Prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropBot",
  description: "Premium Airdrop Farming Bot.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { getToken } = auth();
  const token = await getToken({ template: "App" });

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Providers token={token ?? ""}>
        <html lang="en" className="dark">
          <body className={inter.className}>
            <NavBar />
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
