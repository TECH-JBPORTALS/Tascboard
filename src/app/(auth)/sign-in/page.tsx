import { SignIn } from "@/components/auth/sign-in";
import { loadAuthSearchParams } from "@/lib/search-params";
import { getQueryClient, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const { token } = await loadAuthSearchParams(props.searchParams);
  const queryCient = getQueryClient();

  let email: string | undefined;

  if (token) {
    const invitation = await queryCient.fetchQuery(
      trpc.betterAuth.getInvitationById.queryOptions({ id: token }),
    );
    email = invitation?.email;
  }

  return <SignIn email={email} />;
}
