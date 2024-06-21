import BuyButton from "./BuyButton";
import { Icon } from "@/components";
import { Prisma } from "@/lib/prisma";
import { cn } from "@/utils";

export default async function Page() {
  const packages = await Prisma.package.findMany();
  const packageTypes = [
    {
      type: "Custodial",
      description: "We create wallets for you.",
      benefits: ["We manage your private key.", "You keep 90% of your airdrops"],
    },
    {
      type: "NonCustodial",
      description: "Import your private keys.",
      benefits: [
        "Full control of your private key",
        "You keep 100% of your airdrops",
        "Use previous transaction history for increased chance of airdrop",
      ],
    },
  ] as const;

  return (
    <div className="flex justify-center">
      <div className="flex justify-around gap-8 text-center">
        {packageTypes.map(({ type, description, benefits }, pi) => (
          <div
            key={pi}
            className={cn(
              "flex min-h-[450px] w-[400px] flex-col rounded-2xl bg-gray-200",
              "bg-opacity-5 py-4 ring-4 ring-yellow-400",
            )}
          >
            <p className="text-xl font-extrabold">{type}</p>
            <p>{description}</p>
            <ol className="p-4 text-left text-lg">
              {benefits.map((b, i) => (
                <div key={i} className={cn("flex items-center", b.length > 40 && "items-start")}>
                  <Icon
                    className={cn("pr-2", b.length > 40 && "pt-1")}
                    icon={{ iconName: "circle-check", prefix: "fas" }}
                  />
                  <li key={i}>{b}</li>
                </div>
              ))}
            </ol>

            <BuyButton packages={packages} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}
