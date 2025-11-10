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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow, isPast } from "date-fns";
import { getSession } from "@/utils/auth";
import type { RouterOutputs } from "@/trpc/react";
import Link from "next/link";
import AcceptInvitationButton from "./accept-invitation-button";

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
      <Empty className="max-w-md flex-none border">
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

  // Step 3: Look if invitaion doesn't belong to logged in user
  const user = await api.betterAuth.getByEmail({ email: invitation.email });

  if (session && invitation.email !== session?.user.email)
    return (
      <Empty className="max-w-md flex-none border">
        <EmptyMedia>
          <InvitationAvatarGroup invitation={invitation} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Join to {invitation?.organization.name}</EmptyTitle>
          <EmptyDescription>
            {`Looks like this invite wasn't meant for you. Please signin with invitee account in order to accept this invitation.`}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="text-center">
          <p className="text-muted-foreground text-xs">
            {"You're signed in as"}
          </p>
          <div className="flex items-center gap-1.5 rounded-full border p-1.5">
            <Avatar className="size-6">
              <AvatarImage
                src={session?.user.image ?? "No image"}
                alt="Profile Image"
              />
              <AvatarFallback>{session?.user.email.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>{session?.user.email}</div>
          </div>
          <Button variant={"link"} asChild>
            <Link
              href={
                !user ? `/sign-up?token=${token}` : `/sign-in?token=${token}`
              }
            >
              {!user
                ? `Create account for ${invitation.email}`
                : `Sign in as ${invitation.email}`}
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );

  // Step 4: if no session exist then
  if (!session)
    return (
      <Card className="min-w-md shadow-none">
        <CardHeader className="space-y-6 text-center">
          <InvitationAvatarGroup invitation={invitation} />
          <CardTitle className="text-2xl font-extrabold">
            Join to {invitation?.organization.name}
          </CardTitle>
          <CardDescription>
            <b>{invitation.inviter.name}</b> has invited you to join{" "}
            <b>{invitation.organization.name}</b> as a{" "}
            <b className="capitalize">{invitation.role}</b> on Tascboard. This
            invitation will expire{" "}
            {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant={"link"} asChild>
            <Link
              href={
                !user ? `/sign-up?token=${token}` : `/sign-in?token=${token}`
              }
            >
              {!user
                ? `Create account for ${invitation.email}`
                : `Sign in as ${invitation.email}`}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );

  return (
    <Card className="min-w-md shadow-none">
      <CardHeader className="space-y-6 text-center">
        <InvitationAvatarGroup invitation={invitation} />
        <CardTitle className="text-2xl font-extrabold">
          Join to {invitation?.organization.name}
        </CardTitle>
        <CardDescription>
          <b>{invitation.inviter.name}</b> has invited you to join{" "}
          <b>{invitation.organization.name}</b> as a{" "}
          <b className="capitalize">{invitation.role}</b> on Tascboard. This
          invitation will expire{" "}
          {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {!user ? (
          <Button variant={"link"} asChild>
            <Link href={`/sign-up?token=${token}`}>
              Create account for {invitation.email}
            </Link>
          </Button>
        ) : (
          <AcceptInvitationButton
            invitationId={token}
            organizationSlug={invitation.organization.slug}
          />
        )}
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
    <div className="mx-auto flex items-center justify-center -space-x-3.5">
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
