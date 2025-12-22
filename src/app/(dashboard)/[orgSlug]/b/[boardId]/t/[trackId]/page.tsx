import { auth } from "@/utils/auth";
import { TrackDetailsPage } from "./track-details.page.client";
import { headers } from "next/headers";

export default async function Track() {
  const hasAccessToEdit = await auth.api.hasPermission({
    body: { permission: { track: ["update"] } },
    headers: await headers(),
  });
  return <TrackDetailsPage hasAccessToEdit={hasAccessToEdit.success} />;
}
