import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS classnames with support for conditional classes
 * @param inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
