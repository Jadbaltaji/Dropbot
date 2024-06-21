"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ClerkButton, Icon } from "@/components";
import { trpc } from "@/trpc";

export default function NavBar() {
  const user = trpc.user.getById.useQuery();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Link href="/">
            <h1>DropBot.pro</h1>
          </Link>
          <Link href="/wallets">
            <h1>Wallets</h1>
          </Link>
          <Link href="/routes">
            <h1>Routes</h1>
          </Link>
          {user?.data?.role === "Admin" && (
            <Link href="/playground">
              <h1>Playground</h1>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/packages">
            <Button
              startIcon={
                <Icon
                  icon={{ prefix: "fas", iconName: "wallet" }}
                  className=" child text-yellow-400 group-hover:text-white"
                />
              }
              className="bg-gray-200 bg-opacity-5"
            >
              Buy Wallets
            </Button>
          </Link>
          <Link href="/ref">
            <Button
              startIcon={<Icon icon={{ prefix: "fas", iconName: "coins" }} className="text-yellow-400" />}
              className="bg-gray-200 bg-opacity-5"
              href="/ref"
            >
              {user?.data?.points ?? 0}
            </Button>
          </Link>

          <ClerkButton />
        </div>
      </div>
    </div>
  );
}
