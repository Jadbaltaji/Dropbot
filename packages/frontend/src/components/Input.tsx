"use client";

import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode, Ref } from "react";
import { cn } from "@/utils/ClassName";

const Variants = cva(
  [
    "flex h-10 w-full bg-background px-3 py-2 text-sm",
    "rounded-md border border-input ring-offset-background",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "placeholder:text-muted-foreground",
  ],
  {
    variants: {
      variant: {
        text: "",
        outlined: "",
        filled: "",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-md",
        circular: "rounded-full",
      },
    },
  },
);

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  shape?: "square" | "rounded" | "circular";
  variant?: "text" | "outlined" | "filled";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = forwardRef(function Input(
  {
    className,
    shape = "rounded",
    variant = "text",
    fullWidth = false,
    disabled = false,
    loading = false,
    ...props
  }: InputProps,
  ref: Ref<ElementRef<"input">>,
) {
  const isDisabled = disabled || loading;

  const classNames = cn(
    Variants({ shape, variant }),
    fullWidth && "w-full",
    isDisabled && "cursor-not-allowed opacity-50",
    className,
  );

  return <input ref={ref} className={classNames} {...props} />;
});
