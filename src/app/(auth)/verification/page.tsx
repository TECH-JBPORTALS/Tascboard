import { Verification } from "@/components/auth/verfication";
import { VERIFICATION_EMAIL_COOKIE_NAME } from "@/stores/auth-store";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page() {
  const email = (await cookies()).get(VERIFICATION_EMAIL_COOKIE_NAME);

  if (!email?.value) return notFound();

  return <Verification />;
}
