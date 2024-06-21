"use client";

import { useState, useEffect } from "react";
// @ts-ignore
import CoinbaseCommerceButton from "react-coinbase-commerce";
import { Button } from "@/components";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Package, PackageType } from "@/lib/prisma";
import { trpc } from "@/trpc";

function CheckoutButton({ packages, type }: { packages: Package[]; type: PackageType }) {
  const createCharge = trpc.checkout.createCharge.useMutation();

  const [chargeId, setChargeId] = useState<String>();

  const getChargeId = async (packageId: string) => {
    const chargeId = await createCharge.mutateAsync({ packageId });
    setChargeId(chargeId);
  };

  useEffect(() => {
    getChargeId(packages[0].id);
  }, []);

  return (
    <div className="mt-auto px-4">
      <Select
        onValueChange={(v) => getChargeId(packages.find(({ walletCount }) => String(walletCount) === v)?.id ?? "")}
        defaultValue={String(packages.find((p) => p.type === type)?.walletCount)}
      >
        <SelectTrigger className="ring-2 ring-yellow-400 focus:ring-yellow-400">
          <SelectValue className="ring-2 ring-yellow-400" placeholder="Select a wallet" />
        </SelectTrigger>
        <SelectContent className="ring-2 ring-yellow-400">
          {packages
            .filter((p) => p.type === type)
            .map((p) => (
              <SelectItem key={p.id} value={String(p.walletCount)}>
                <p>{p.walletCount === 1 ? `1 Wallet` : `${p.walletCount} Wallets`}</p>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Button
        color="primary"
        variant="contained"
        className="mt-4 w-full bg-yellow-400 ring-2 ring-yellow-400"
        loading={createCharge.isLoading}
        slots={{ root: CoinbaseCommerceButton }}
        chargeId={chargeId}
        disableCaching={true}
      >
        Buy Now!
      </Button>
    </div>
  );
}

export default CheckoutButton;
