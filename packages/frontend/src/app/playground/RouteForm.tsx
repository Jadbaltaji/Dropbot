"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { trpc } from "@/trpc";
import { truncate } from "@/utils";

const routes = [
  "Refuel",
  "Consolidate",
  "LiFi",
  "Angle",
  "Stargate ETH",
  "Stargate USDC",
  "Btc Bridge",
  "PancakeSwap",
] as const;

const formSchema = z.object({
  wallet: z.string().min(42),
  route: z.enum(routes),
});

function RouteForm({ wallets }: { wallets: Wallet[] }) {
  const lifi = trpc.playground.lifi.useMutation();
  const angle = trpc.playground.angleRoute.useMutation();
  const stargateETH = trpc.playground.stargateEth.useMutation();
  const stargateUSDC = trpc.playground.stargateUsdc.useMutation();
  const btcBridge = trpc.playground.bitcoinBridgeRoute.useMutation();
  const pancakeSwap = trpc.playground.pancakeSwapRoute.useMutation();
  const consolidate = trpc.playground.consolidate.useMutation();
  const refuel = trpc.playground.refuel.useMutation();

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { wallet } = values;
    switch (values.route) {
      case "Refuel": {
        await refuel.mutateAsync({ wallet });
        break;
      }
      case "Consolidate": {
        await consolidate.mutateAsync({ wallet });
        break;
      }
      case "Angle": {
        await angle.mutateAsync({ wallet });
        break;
      }
      case "LiFi": {
        await lifi.mutateAsync({ wallet });
        break;
      }
      case "Stargate ETH": {
        await stargateETH.mutateAsync({ wallet });
        break;
      }
      case "Stargate USDC": {
        await stargateUSDC.mutateAsync({ wallet });
        break;
      }
      case "Btc Bridge": {
        await btcBridge.mutateAsync({ wallet });
        break;
      }
      case "PancakeSwap": {
        await pancakeSwap.mutateAsync({ wallet });
        break;
      }
    }
    router.refresh();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] space-y-8">
        <FormField
          control={form.control}
          name="wallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a wallet:</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.address} value={wallet.address}>
                        {truncate(wallet.address)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Route:</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default RouteForm;
