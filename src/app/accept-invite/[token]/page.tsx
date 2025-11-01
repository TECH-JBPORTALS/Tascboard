import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, getSession } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getSession();

  if (!session?.user) redirect(`/sign-in?invite=${token}`);

  const invitation = await auth.api.getInvitation({
    query: { id: token },
    headers: await headers(),
  });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
