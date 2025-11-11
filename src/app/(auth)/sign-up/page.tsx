import { SignUp } from "@/components/auth/sign-up";
import { loadAuthSearchParams } from "@/lib/search-params";
import { trpc, getQueryClient } from "@/trpc/server";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const { token } = await loadAuthSearchParams(props.searchParams);
  const queryClient = getQueryClient();

  if (!token) notFound();

  const invitation = await queryClient.fetchQuery(
    trpc.betterAuth.getInvitationById.queryOptions({ id: token }),
  );

  if (!invitation) notFound();

  return <SignUp email={invitation.email} />;
}
