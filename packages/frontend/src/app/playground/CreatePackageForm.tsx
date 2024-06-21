"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { trpc } from "@/trpc";

const packageTypes = ["Custodial", "NonCustodial"] as const;

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  walletCount: z.coerce.number(),
  type: z.enum(packageTypes),
});

function RouteForm() {
  const router = useRouter();
  const createPackage = trpc.checkout.createPackage.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createPackage.mutateAsync(values);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Description:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price in USD:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="walletCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Count:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Type:</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
