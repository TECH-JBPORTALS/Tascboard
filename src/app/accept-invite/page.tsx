import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import AcceptInvitationButton from "./accept-invitation-button";
import { db } from "@/server/db";
import { invitation, user, organization } from "@/server/db/auth-schema";
import { eq } from "drizzle-orm";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/sign-in");
  }

  // Fetch the session to check if user is logged in
  const session = await auth.api.getSession({ headers: await headers() });

  // Fetch invitation details
  const invitationData = await db
    .select({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      organizationId: invitation.organizationId,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      inviterId: invitation.inviterId,
      inviterName: user.name,
      inviterEmail: user.email,
    })
    .from(invitation)
    .where(eq(invitation.id, token))
    .leftJoin(organization, eq(invitation.organizationId, organization.id))
    .leftJoin(user, eq(invitation.inviterId, user.id))
    .limit(1);

  const invite = invitationData[0];

  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">
              Invitation Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              This invitation link is invalid or has expired.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if invitation is expired
  if (invite.expiresAt < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">
              Invitation Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              This invitation has expired. Please contact{" "}
              <strong>{invite.inviterName}</strong> to request a new invitation.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if invitation is already accepted
  if (invite.status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">
              Invitation Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              You have already accepted this invitation to join{" "}
              <strong>{invite.organizationName}</strong>.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/sign-in">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If user is not logged in, redirect to sign in with the token
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold">
              Join {invite.organizationName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-sm font-medium">
                You&apos;re being invited as:
              </p>
              <p className="text-2xl font-semibold capitalize">
                {invite.role ?? "Member"}
              </p>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              <strong>{invite.inviterName}</strong> ({invite.inviterEmail}) has
              invited you to join this organization.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full" size="lg">
              <Link href={`/sign-in?invite=${token}`}>Sign In to Accept</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If the user is logged in, show the acceptance UI
  const roleDisplayName = invite.role === "owner" ? "Owner" : "Employee";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            Join {invite.organizationName}?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              Organization
            </p>
            <p className="text-xl font-semibold">{invite.organizationName}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              Your Role
            </p>
            <p className="text-xl font-semibold capitalize">
              {roleDisplayName}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              Invited by
            </p>
            <p className="text-lg font-semibold">{invite.inviterName}</p>
            <p className="text-muted-foreground text-sm">
              {invite.inviterEmail}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <AcceptInvitationButton
            invitationId={token}
            organizationSlug={invite.organizationSlug ?? ""}
          />
          <Button variant="ghost" asChild className="w-full">
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
