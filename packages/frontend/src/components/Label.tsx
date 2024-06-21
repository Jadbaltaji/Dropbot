import * as LabelPrimitive from "@radix-ui/react-label";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, Ref } from "react";
import { cn } from "@/utils/ClassName";

export const Label = forwardRef(function Label(
  { className, ...props }: ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  ref: Ref<ElementRef<typeof LabelPrimitive.Root>>,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});
