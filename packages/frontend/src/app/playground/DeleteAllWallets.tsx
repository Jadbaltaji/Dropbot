"use client";
import { Button } from "@/components";
import { trpc } from "@/trpc";

export default function () {
  // const deleteWallets = trpc.playground.DELETE_ALL_WALLETS.useMutation();
  //
  return (
    <Button
      disabled
      // onClick={ () => deleteWallets.mutateAsync() }
    >
      DELETE ALL
    </Button>
  );
}
