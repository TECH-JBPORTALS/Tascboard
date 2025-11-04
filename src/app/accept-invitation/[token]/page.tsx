import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await api.betterAuth.getInvitationById({ id: token });

  return (
    <Card className="min-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto my-6 flex items-center justify-center -space-x-3.5">
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
        <CardTitle className="text-2xl font-extrabold">
          {invitation?.inviter.name} has invited you to{" "}
          {invitation?.organization.name}
        </CardTitle>
        <CardDescription>
          This invitation is does not for you. May be you should login to your
          other account.
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
