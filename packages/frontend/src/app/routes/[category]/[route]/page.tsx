import { currentUser } from "@clerk/nextjs";
import { RouteList } from "@dropbot/api-server/src/features/routes/routes";
import Image from "next/image";
import { redirect } from "next/navigation";
import RunRouteForm from "@/app/routes/[category]/[route]/RunRouteForm";
import { Prisma } from "@/lib/prisma";
import { trpc } from "@/trpc";
import { cn } from "@/utils";

const Page = ({ params }: { params: { category: string; route: string } }) => {
  const currentCategory = RouteList.find((route) => route.name.toLowerCase() === params.category);
  const currentRoute = currentCategory?.routes.find((r) => r.id === Number(params.route));

  if (!currentCategory || !currentRoute) {
    redirect("/");
  }
  return (
    <div className="flex w-full justify-center">
      <div
        className={cn(
          "flex w-[500px] flex-col rounded-2xl bg-gray-200 p-4",
          "gap-4 bg-opacity-5 py-4 ring-4 ring-yellow-400",
        )}
      >
        <div className="relative h-[100px] w-full">
          <Image fill className="object-contain" alt={params.route} src={currentRoute.imageLink} />
        </div>
        <p className="text-center">{currentRoute.name}</p>

        <p>{currentRoute.description}</p>
        <RunRouteForm route={currentRoute.route} />
      </div>
    </div>
  );
};

export default Page;
