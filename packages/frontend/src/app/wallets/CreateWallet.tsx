"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { trpc } from "@/trpc";

function CreateWallet() {
  const router = useRouter();
  const user = trpc.user.getById.useQuery();

  const createWallet = trpc.wallet.create.useMutation();

  const onClick = async () => {
    await createWallet.mutateAsync();
    router.refresh();
  };

  if (user?.data?.role !== "Admin") {
    return null;
  }
  return (
    <Button onClick={onClick} variant="contained" loading={createWallet.isLoading}>
      Add Wallet
    </Button>
  );
}

export default CreateWallet;
