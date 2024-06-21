import { Icon } from "./Icon";
import { cva } from "class-variance-authority";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  FC,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  Ref,
} from "react";
import { cn } from "@/utils/ClassName";

export type ButtonProps<R extends ElementType> = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "icon";
  shape?: "square" | "rounded" | "circular";
  color?: "inherit" | "primary" | "brand" | "error";
  variant?: "text" | "contained";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  slots?: { root?: R };
}> &
  ComponentPropsWithoutRef<R>;

export interface ButtonWithRef extends FC<ButtonProps<ElementType>> {
  <Root extends ElementType = ElementType>(props: ButtonProps<Root> & ElementRef<Root>): ReturnType<
    FC<ButtonProps<Root>>
  >;
}

const Variants = cva(
  [
    "flex items-center justify-center text-sm font-medium ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        text: "bg-transparent hover:bg-transparent hover:text-accent-foreground",
        contained: "bg-opacity-100 hover:bg-opacity-90",
      },
      color: {
        inherit: "bg-inherit text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        brand: "bg-brand text-brand-foreground",
        error: "bg-error text-error-foreground",
      },
      size: {
        sm: "h-9 px-2",
        md: "h-10 px-3",
        lg: "h-11 px-4",
        icon: "h-10 w-10",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-md",
        circular: "rounded-full",
      },
    },
  },
);

export const Button: ButtonWithRef = forwardRef(function Button(
  {
    children,
    className,
    startIcon,
    endIcon,
    size = "md",
    shape = "rounded",
    color = "inherit",
    variant = "text",
    fullWidth = false,
    disabled = false,
    loading = false,
    slots,
    ...props
  },
  ref: Ref<HTMLButtonElement>,
) {
  const Root = slots?.root ?? "button";
  const isDisabled = disabled || loading;

  const classNames = cn(
    Variants({ color, size, shape, variant }),
    fullWidth && "w-full",
    isDisabled && "pointer-events-none opacity-50",
    className,
  );

  return (
    <Root ref={ref} className={classNames} {...props}>
      {loading && (
        <div className="mr-2 flex items-center">
          <Icon icon={{ prefix: "fas", iconName: "circle-notch" }} fixedWidth spin />
        </div>
      )}
      {startIcon && !loading && <div className="mr-2 flex items-center">{startIcon}</div>}
      {children}
      {endIcon && <div className="ml-2 flex items-center">{endIcon}</div>}
    </Root>
  );
});
