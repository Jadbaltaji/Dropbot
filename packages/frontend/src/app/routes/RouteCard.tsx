"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { AspectRatio } from "@/components/AspectRatio";
import { cn } from "@/utils";

const RouteCard = <T extends string>({
  name,
  className,
  src,
  route,
}: {
  name: string;
  src: string;
  className?: string;
  route?: Route<T>;
}) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "bg-gray-200 bg-opacity-5 ring-4 ring-yellow-400",
        `relative flex min-w-[175px] flex-col items-center gap-4`,
        "cursor-pointer rounded-2xl p-4 px-8 transition-all duration-500 hover:scale-110",
        "hover:rounded-xl",
        className,
      )}
      onClick={() => route && router.push(route)}
    >
      <div className="relative h-[100px] w-full">
        <Image fill className="object-contain" alt={name} src={src} />
      </div>

      <p>{name}</p>
    </div>
  );
};

export default RouteCard;
