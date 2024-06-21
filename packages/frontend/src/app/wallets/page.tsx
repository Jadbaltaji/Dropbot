import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet";
import WalletsTable from "./WalletsTable";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  return (
    <div>
      <div className="mx-4 flex flex-row justify-end gap-4">
        <CreateWallet />
        <ImportWallet />
      </div>
      <WalletsTable />
    </div>
  );
}
