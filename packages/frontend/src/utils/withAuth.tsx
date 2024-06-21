import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { Prisma, UserRole } from "@/lib/prisma";

type Page<T extends unknown> = (props: T) => JSX.Element | Promise<JSX.Element>;

export function withAuth<T extends Record<string, unknown>>(page: Page<T>, roles: UserRole[] = []) {
  return async function (props: T) {
    const user = await currentUser();

    // If the user is not logged in, redirect to the login page.
    if (!user) {
      return redirect("/");
    }

    const { role } = await Prisma.user.findUniqueOrThrow({ where: { id: user.id } });

    // If roles are specified, check if the user has the required roles.
    if (roles?.length > 0 && !roles.includes(role)) {
      return redirect("/");
    }

    return page({ ...props, user });
  };
}
