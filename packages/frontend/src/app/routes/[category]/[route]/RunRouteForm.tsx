"use client";

import { Routes } from "@dropbot/api-server/src/features/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { trpc } from "@/trpc";
import { formatDecimal, truncate } from "@/utils";

const formSchema = z.object({
  wallet: z.string(),
});
const RunRouteForm = ({ route }: { route: Routes }) => {
  // disable if balance is too low
  const { data: wallets = [], isLoading } = trpc.wallet.getAllForUser.useQuery(undefined);
  const routes = trpc.routes.execute.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedWallet = wallets.find((w) => w.address === values.wallet);
    if (Number(selectedWallet?.balance) < 0.05) {
      form.setError("wallet", {
        message: "Insufficient Balance",
      });
    }
    await routes.mutateAsync({ wallet: values.wallet, route });
  };

  if (wallets === undefined || wallets.length < 1 || isLoading) {
    return <p>No existing wallets on this account. Buy some here.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="wallet"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="ring-2 ring-yellow-400 focus:ring-yellow-400">
                    <SelectValue className="ring-2 ring-yellow-400" placeholder="Select a wallet" />
                  </SelectTrigger>
                  <SelectContent className="ring-2 ring-yellow-400">
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.address} value={wallet.address}>
                        {`${truncate(wallet.address)} - Ξ ${formatDecimal(wallet.balance)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className="mt-4 w-full bg-yellow-400 ring-2 ring-yellow-400"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default RunRouteForm;
