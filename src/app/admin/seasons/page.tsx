import { redirect } from "next/navigation";
import { getManagedSeasons } from "@/app/actions/seasons";
import { SeasonsManager } from "./seasons-manager";
import { getSession } from "@/lib/auth";

export default async function AdminSeasonsPage() {
  const userSession = await getSession();
  if (!userSession || userSession.role !== "admin") redirect("/login");

  const seasons = await getManagedSeasons();

  return (
    <div className="py-10">
      <SeasonsManager seasons={seasons} />
    </div>
  );
}
