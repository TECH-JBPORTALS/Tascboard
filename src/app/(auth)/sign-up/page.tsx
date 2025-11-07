import { SignUp } from "@/components/auth/sign-up";
import { loadAuthSearchParams } from "@/lib/search-params";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const { token } = await loadAuthSearchParams(props.searchParams);

  if (!token) notFound();

  const invitation = await api.betterAuth.getInvitationById({ id: token });

  if (!invitation) notFound();

  return <SignUp email={invitation.email} />;
}
