import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { formatDistanceToNow, isPast } from "date-fns";
import { getSession } from "@/utils/auth";
import type { RouterOutputs } from "@/trpc/react";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await api.betterAuth.getInvitationById({ id: token });
  const session = await getSession();

  // Step 1: Check for invitation existance
  if (!invitation) notFound();

  // Step 2: Check for invitation expiry timestamp
  if (isPast(invitation.expiresAt))
    return (
      <Empty className="max-w-md border">
        <EmptyMedia className="grayscale-100">
          <InvitationAvatarGroup invitation={invitation} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Invitation expired</EmptyTitle>
          <EmptyDescription>
            This invitation seems expired{" "}
            <i>
              {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}
            </i>
            . Ask <b>{invitation.inviter.name}</b> to resend it again if you
            intend to join <b>{invitation.organization.name}</b>.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  // Step 3: Redirect to sign up if invited user doesn't have account
  const user = await api.user.getByEmail({ email: invitation.email });

  if (!user) redirect(`/sign-up?token=${token}`);

  // Step 4: Redirect to sign in if there is no session active
  if (!session) redirect(`/sign-in?token=${token}`);

  // Step 5: Look if invitaion doesn't belong to logged in user
  if (invitation.email !== session.user.email)
    return (
      <Empty className="max-w-md border">
        <EmptyMedia>
          <InvitationAvatarGroup invitation={invitation} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Sign in with another account</EmptyTitle>
          <EmptyDescription>This invitation seems not for you</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <Card className="min-w-md">
      <CardHeader className="text-center">
        <InvitationAvatarGroup invitation={invitation} />
        <CardTitle className="text-2xl font-extrabold">
          Join to {invitation?.organization.name}
        </CardTitle>
        <CardDescription>
          {`Looks like this invite wasn't meant for you. Please sig-in with
          another account in order to accept this invitation.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size={"lg"} className="w-full">
          Accept Invitation
        </Button>
      </CardContent>
    </Card>
  );
}

function InvitationAvatarGroup({
  invitation,
}: {
  invitation: RouterOutputs["betterAuth"]["getInvitationById"];
}) {
  return (
    <div className="mx-auto flex items-center justify-center -space-x-3.5 grayscale-100">
      <Avatar className="size-16">
        <AvatarImage
          src={invitation?.inviter.image ?? ""}
          alt={"Inviter Profile Image"}
        />
        <AvatarFallback className="text-2xl font-extrabold">
          {invitation?.inviter.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarFallback className="border-card border-2 bg-gradient-to-l! from-[#f97316] via-[#e11d48] to-[#ef4444] text-2xl font-extrabold">
          {invitation?.organization.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
