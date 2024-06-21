"use client";

import { Icon } from "./Icon";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentPropsWithoutRef, createContext, ElementRef, forwardRef, Ref, useContext, useState } from "react";
import { cn } from "@/utils/ClassName";

type DialogContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContext>({
  open: false,
  setOpen: () => undefined,
});

export const Dialog = (props: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) => {
  const [open, setOpen] = useState(props.defaultOpen ?? props.open ?? false);

  return (
    <DialogContext.Provider value={{ open, setOpen, ...props }}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DialogContext.Provider>
  );
};

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = ({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => (
  <DialogPrimitive.Portal className={cn(className)} {...props} />
);

export const DialogOverlay = forwardRef(function DialogOverlay(
  { className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
  ref: Ref<ElementRef<typeof DialogPrimitive.Overlay>>,
) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
      {...props}
    />
  );
});

export const DialogContent = forwardRef(function DialogContent(
  { className, children, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  ref: Ref<ElementRef<typeof DialogPrimitive.Content>>,
) {
  const { open } = useContext(DialogContext);

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay forceMount asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", duration: 0.55 }}
            />
          </DialogOverlay>
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full",
              className,
            )}
            {...props}
            asChild
            forceMount
          >
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              {children}
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Icon icon={{ prefix: "fas", iconName: "close" }} className="h-4 w-4" fixedWidth />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
});

export const DialogHeader = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

export const DialogTitle = forwardRef(function DialogTitle(
  { className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
  ref: Ref<ElementRef<typeof DialogPrimitive.Title>>,
) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});

export const DialogDescription = forwardRef(function DialogDescription(
  { className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
  ref: Ref<ElementRef<typeof DialogPrimitive.Description>>,
) {
  return (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
});
