import { currentUser } from "@clerk/nextjs";

import CopyButton from "@/components/CopyButton";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return <p>You must be signed in to continue</p>;
  }

  return (
    <div>
      <CopyButton valueToCopy={`https://dropbot.pro/ref/${user?.username}`} name="Referral Link" />
    </div>
  );
}
