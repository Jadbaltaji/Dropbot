import RouteCard from "../RouteCard";
import { RouteList } from "@dropbot/api-server/src/features/routes/routes";
import { redirect } from "next/navigation";

const Page = ({ params }: { params: { category: string } }) => {
  const currentCategory = RouteList.find((route) => route.name.toLowerCase() === params.category);

  if (!currentCategory) {
    redirect("/");
  }

  return (
    <>
      <h1 className="text-center text-xl">Routes</h1>
      <div className="m-4 flex justify-center gap-4">
        {currentCategory.routes.map((route) => (
          <RouteCard
            route={`/routes/${params.category.toLowerCase()}/${route.id}`}
            src={route.imageLink}
            className="from-green-500 to-green-800"
            name={route.name}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
