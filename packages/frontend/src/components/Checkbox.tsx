import { Icon } from "./Icon";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, Ref } from "react";
import { cn } from "@/utils/ClassName";

export const Checkbox = forwardRef(function Checkbox(
  { className, ...props }: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  ref: Ref<ElementRef<typeof CheckboxPrimitive.Root>>,
) {
  const classNames = cn(
    [
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    ],
    className,
  );

  return (
    <CheckboxPrimitive.Root ref={ref} className={classNames} {...props}>
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <Icon icon={{ prefix: "fas", iconName: "check" }} className="h-3 w-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
