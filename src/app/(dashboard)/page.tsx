import { getFullOrganization, setActiveOrganization } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const activeOrganization = await getFullOrganization();

  if (activeOrganization) redirect(`/${activeOrganization.slug}`);

  const activatedOrgnization = await setActiveOrganization();

  if (activatedOrgnization) redirect(`/${activatedOrgnization.slug}`);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <span>Loading...</span>
    </div>
  );
}
