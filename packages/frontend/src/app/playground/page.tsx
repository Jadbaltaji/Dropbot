import CreatePackageForm from "./CreatePackageForm";
import PointsForm from "./PointsForm";
import RouteForm from "./RouteForm";
import { currentUser } from "@clerk/nextjs";
import DeleteAllWallets from "@/app/playground/DeleteAllWallets";
import { Prisma } from "@/lib/prisma";
import { withAuth } from "@/utils/withAuth";

async function Page() {
  const user = await currentUser();
  const wallets = await Prisma.wallet.findMany({ where: { userId: user?.id } });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1>Add Points</h1>
      <PointsForm />
      <h1>Run a route</h1>
      <RouteForm wallets={wallets} />
      <h1>Create a package</h1>
      <CreatePackageForm />
      <DeleteAllWallets />
    </div>
  );
}

export default withAuth(Page, ["Admin"]);
