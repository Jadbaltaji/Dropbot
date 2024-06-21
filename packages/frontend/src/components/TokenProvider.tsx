"use client";
import { createContext, ReactNode } from "react";

export const TokenContext = createContext<string>("");

export const TokenProvider = ({ children, token }: { children: ReactNode; token: string }) => {
  return <TokenContext.Provider value={token ?? ""}>{children}</TokenContext.Provider>;
};
