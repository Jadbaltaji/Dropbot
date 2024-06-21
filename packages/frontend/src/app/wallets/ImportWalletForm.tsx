import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "ethers";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Input } from "@/components/Input";
import { trpc } from "@/trpc";

const formSchema = z.object({
  privateKey: z.string().min(64, {
    message: "Private Key must be at least 64 Characters Long.",
  }),
});

export function ImportWalletForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const router = useRouter();
  const importWallet = trpc.wallet.import.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privateKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const wallet = new Wallet(values.privateKey);

      await importWallet.mutateAsync({ privateKey: wallet.privateKey });
      onFormSubmit();
      router.refresh();
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message.includes("invalid hexlify value")
        ? "Invalid Private Key"
        : "An unexpected error occurred.";
      form.setError("privateKey", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="privateKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please Enter your Private Key:</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="off" data-lpignore="true" data-form-type="other" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={importWallet.isLoading} type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </form>
    </Form>
  );
}
