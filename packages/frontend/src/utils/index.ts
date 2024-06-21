export function truncate(address: string): string {
  return `${address.substring(0, 4)}...${address.slice(-4)}`;
}

export function formatDecimal(input: string): string {
  const [integerPart, decimalPart] = input.split(".");

  if (!decimalPart) {
    return input;
  }

  const slicedDecimalPart = decimalPart.slice(0, 3);

  return `${integerPart}.${slicedDecimalPart}`;
}

export * from "./ClassName";
