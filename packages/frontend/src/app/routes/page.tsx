import RouteCard from "./RouteCard";
import { RouteList } from "@dropbot/api-server/src/features/routes/routes";

const Page = () => {
  return (
    <>
      <h1 className="text-center text-xl">Routes</h1>
      <div className="m-4 flex justify-center gap-4">
        {RouteList.map((route) => (
          <RouteCard route={`/routes/${route.name.toLowerCase()}`} src={route.imageLink} name={route.name} />
        ))}
      </div>
    </>
  );
};

export default Page;
