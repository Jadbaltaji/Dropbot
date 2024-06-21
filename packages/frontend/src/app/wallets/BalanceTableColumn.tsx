"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";
import { Button, Icon } from "@/components";
import { Checkbox } from "@/components/Checkbox";
import CopyButton from "@/components/CopyButton";
import { DialogContent, DialogTrigger, Dialog, DialogTitle } from "@/components/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/DropdownMenu";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { trpc } from "@/trpc";
import { formatDecimal } from "@/utils";

type DialogType = "Deposit" | "Withdraw";

const DepositDialogContent = ({ address }: { address: string }) => {
  const [depositCriteria, setDepositCriteria] = useState<CheckedState>(false);
  const [termsAndConditions, setTermsAndConditions] = useState<CheckedState>(false);

  const agreed = depositCriteria && termsAndConditions;

  return (
    <DialogContent>
      <DialogTitle>Deposit Criteria:</DialogTitle>
      <ul className="ml-4 list-disc">
        <li>We currently only support Arbitrum ETH deposits.</li>
        <li>
          It is HIGHLY RECOMMENDED that you deposit using a centralized exchange. This is to prevent this wallet being
          tracked to your main wallets.
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <Checkbox checked={depositCriteria} onCheckedChange={setDepositCriteria} id="criteria" />
        <Label htmlFor="criteria">I have read the deposit criteria above.</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={termsAndConditions} onCheckedChange={setTermsAndConditions} id="terms" />
        <Label htmlFor="terms">I agree to the terms & conditions.</Label>
      </div>
      <Input
        disabled
        readOnly
        value={address}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        type={agreed ? "text" : "password"}
        aria-label={"I have read the terms & conditions."}
      />
      <CopyButton name="wallet" valueToCopy={address} disabled={!agreed} />
    </DialogContent>
  );
};

const WithdrawDialogContent = ({ address }: { address: string }) => {
  const [value, setValue] = useState("");
  const [withdrawCriteria, setWithdrawCriteria] = useState<CheckedState>(false);
  const [termsAndConditions, setTermsAndConditions] = useState<CheckedState>(false);
  const agreed = withdrawCriteria && termsAndConditions;
  const withdraw = trpc.wallet.withdraw.useMutation();

  const submitWithdraw = async () => {
    await withdraw.mutateAsync({ fromWalletAddress: address, toWalletAddress: value });
  };

  return (
    <DialogContent>
      <DialogTitle>Withdraw Criteria:</DialogTitle>
      <ul className="ml-4 list-disc">
        <li>We currently only support Arbitrum ETH withdraws.</li>
        <li>
          It is HIGHLY RECOMMENDED that you withdraw to a centralized exchange. This is to prevent this wallet being
          tracked to your main wallets.
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <Checkbox checked={withdrawCriteria} onCheckedChange={setWithdrawCriteria} id="criteria" />
        <Label htmlFor="criteria">I have read the withdraw criteria above.</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={termsAndConditions} onCheckedChange={setTermsAndConditions} id="terms" />
        <Label htmlFor="terms">I agree to the terms & conditions.</Label>
      </div>
      <Input placeholder={"Enter withdraw address here ..."} value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        onClick={submitWithdraw}
        disabled={!agreed}
        startIcon={<Icon icon={{ prefix: "fas", iconName: "arrow-right-from-bracket" }} />}
      >
        Submit
      </Button>
    </DialogContent>
  );
};

const BalanceTableColumn = ({ address, balance }: { address: string; balance: string }) => {
  const [dialog, setDialog] = useState<DialogType>("Deposit");
  const user = trpc.user.getById.useQuery();
  const deleteWallet = trpc.playground.DELETE_WALLET.useMutation();
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialog("Deposit")}>Deposit</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialog("Withdraw")}>Withdraw</DropdownMenuItem>
          </DialogTrigger>
          {user?.data?.role === "Admin" && (
            <DropdownMenuItem onClick={() => deleteWallet.mutateAsync({ name: address })}>DELETE</DropdownMenuItem>
          )}
        </DropdownMenuContent>

        {dialog === "Deposit" ? (
          <DepositDialogContent address={address} />
        ) : (
          <WithdrawDialogContent address={address} />
        )}

        <DropdownMenuTrigger asChild>
          <Button endIcon={<Icon icon={{ prefix: "fas", iconName: "ellipsis-vertical" }} />}>
            Ξ {formatDecimal(balance)}
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </Dialog>
  );
};

export default BalanceTableColumn;
