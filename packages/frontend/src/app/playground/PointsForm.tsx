"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Input } from "@/components/Input";
import { trpc } from "@/trpc";

const formSchema = z.object({
  pointsToAdd: z.coerce.number(),
});

function PointsForm() {
  const points = trpc.playground.addPoints.useMutation();

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await points.mutateAsync({ pointsToAdd: values.pointsToAdd });
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
          name="pointsToAdd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Points:</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
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

export default PointsForm;
