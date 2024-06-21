/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { Icon } from "./Icon";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, Ref } from "react";
import { cn } from "@/utils/ClassName";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuSubTrigger = forwardRef(function DropdownMenuSubTrigger(
  {
    className,
    inset,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  },
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.SubTrigger>>,
) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <Icon icon={{ prefix: "fas", iconName: "chevron-right" }} className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

export const DropdownMenuSubContent = forwardRef(function DropdownMenuSubContent(
  { className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>,
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.SubContent>>,
) {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        className,
      )}
      {...props}
    />
  );
});

export const DropdownMenuContent = forwardRef(function DropdownMenuContent(
  { className, sideOffset = 4, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.Content>>,
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

export const DropdownMenuItem = forwardRef(function DropdownMenuItem(
  {
    className,
    inset,
    ...props
  }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  },
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.Item>>,
) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
});

export const DropdownMenuCheckboxItem = forwardRef(function DropdownMenuCheckboxItem(
  { className, children, checked, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>,
) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon icon={{ prefix: "fas", iconName: "check" }} className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = forwardRef(function DropdownMenuRadioItem(
  { className, children, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.RadioItem>>,
) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon icon={{ prefix: "fas", iconName: "circle" }} className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});

export const DropdownMenuLabel = forwardRef(function DropdownMenuLabel(
  {
    className,
    inset,
    ...props
  }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  },
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.Label>>,
) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef(function DropdownMenuSeparator(
  { className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>,
  ref: Ref<ElementRef<typeof DropdownMenuPrimitive.Separator>>,
) {
  return <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />;
});

export const DropdownMenuShortcut = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
