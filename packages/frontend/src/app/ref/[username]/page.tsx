import { SignUpButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components";
import { Prisma } from "@/lib/prisma";
async function UserPage({ params }: { params: { username: string } }) {
  const clerkUser = await currentUser();
  const user = await Prisma.user.findFirst({ where: { username: params.username } });

  if (!user || clerkUser) {
    redirect("/");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1>{params.username} has referred you!</h1>
      <SignUpButton mode={"modal"} unsafeMetadata={{ invitedByUserId: user?.id ?? null }}>
        <Button variant="contained" color="primary">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
}

export default UserPage;
