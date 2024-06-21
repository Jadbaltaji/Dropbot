"use client";

import { Icon } from "./Icon";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, Ref } from "react";
import { cn } from "@/utils/ClassName";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef(function SelectTrigger(
  { className, children, ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  ref: Ref<ElementRef<typeof SelectPrimitive.Trigger>>,
) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon icon={{ prefix: "fas", iconName: "chevron-down" }} className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef(function SelectContent(
  { className, children, position = "popper", ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
  ref: Ref<ElementRef<typeof SelectPrimitive.Content>>,
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectLabel = forwardRef(function SelectLabel(
  { className, ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Label>,
  ref: Ref<ElementRef<typeof SelectPrimitive.Label>>,
) {
  return (
    <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
  );
});

export const SelectItem = forwardRef(function SelectItem(
  { className, children, ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
  ref: Ref<ElementRef<typeof SelectPrimitive.Item>>,
) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon icon={{ prefix: "fas", iconName: "check" }} className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

export const SelectSeparator = forwardRef(function SelectSeparator(
  { className, ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>,
  ref: Ref<ElementRef<typeof SelectPrimitive.Separator>>,
) {
  return <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
});
