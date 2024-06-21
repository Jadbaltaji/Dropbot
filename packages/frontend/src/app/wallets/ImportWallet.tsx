"use client";

import { useState } from "react";
import { ImportWalletForm } from "@/app/wallets/ImportWalletForm";
import { Button } from "@/components/Button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/Dialog";

function ImportWallet() {
  const [open, setOpen] = useState(false);

  const handleWalletImported = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="contained">Import Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <ImportWalletForm onFormSubmit={handleWalletImported} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ImportWallet;
