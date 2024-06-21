import { ComponentPropsWithoutRef, ElementRef, forwardRef, Ref } from "react";
import { cn } from "@/utils/ClassName";

export const Table = forwardRef(function Table(
  { className, ...props }: ComponentPropsWithoutRef<"table">,
  ref: Ref<ElementRef<"table">>,
) {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
});

export const TableHeader = forwardRef(function TableHeader(
  { className, ...props }: ComponentPropsWithoutRef<"thead">,
  ref: Ref<ElementRef<"thead">>,
) {
  return <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />;
});

export const TableBody = forwardRef(function TableBody(
  { className, ...props }: ComponentPropsWithoutRef<"tbody">,
  ref: Ref<ElementRef<"tbody">>,
) {
  return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
});

export const TableFooter = forwardRef(function TableFooter(
  { className, ...props }: ComponentPropsWithoutRef<"tfoot">,
  ref: Ref<ElementRef<"tfoot">>,
) {
  return <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} />;
});

export const TableRow = forwardRef(function TableRow(
  { className, ...props }: ComponentPropsWithoutRef<"tr">,
  ref: Ref<ElementRef<"tr">>,
) {
  return (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  );
});

export const TableHead = forwardRef(function TableHead(
  { className, ...props }: ComponentPropsWithoutRef<"th">,
  ref: Ref<ElementRef<"th">>,
) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
});

export const TableCell = forwardRef(function TableCell(
  { className, ...props }: ComponentPropsWithoutRef<"td">,
  ref: Ref<ElementRef<"td">>,
) {
  return <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />;
});

export const TableCaption = forwardRef(function TableCaption(
  { className, ...props }: ComponentPropsWithoutRef<"caption">,
  ref: Ref<ElementRef<"caption">>,
) {
  return <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;
});
