"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";

interface AcceptInvitationButtonProps {
  invitationId: string;
  organizationSlug: string;
}

export default function AcceptInvitationButton({
  invitationId,
  organizationSlug,
}: AcceptInvitationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    setIsLoading(true);
    try {
      // Accept the invitation using Better Auth client
      const result = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("Successfully joined the organization!");

      // Redirect to the organization's dashboard
      router.push(`/${organizationSlug}`);
      router.refresh();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to accept invitation. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAccept}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Accepting...
        </>
      ) : (
        "Accept Invitation"
      )}
    </Button>
  );
}
