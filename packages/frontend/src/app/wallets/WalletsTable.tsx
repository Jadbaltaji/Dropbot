"use client";
import BalanceTableColumn from "@/app/wallets/BalanceTableColumn";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { trpc } from "@/trpc";
import { truncate } from "@/utils";

const WalletsTable = () => {
  const { data: wallets } = trpc.wallet.getAllForUser.useQuery(undefined, { refetchInterval: 5000 });

  return (
    <Table>
      <TableCaption>A list of your active wallets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Address</TableHead>
          <TableHead>Modules</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wallets?.map((wallet) => {
          const status = wallet.RouteJob.find((route) => route.status !== "Idle")?.status ?? "Idle";
          return (
            <TableRow key={wallet.address}>
              <TableCell className="font-medium">{truncate(wallet.address)}</TableCell>
              <TableCell>LayerZero</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell className="align flex flex-row items-center justify-end">
                <BalanceTableColumn address={wallet.address} balance={wallet.balance} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default WalletsTable;
