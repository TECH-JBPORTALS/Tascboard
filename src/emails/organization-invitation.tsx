import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { baseUrl } from "./utils";

interface OrganizationInvitationEmailProps {
  inviterName?: string;
  inviterEmail?: string;
  organizationName?: string;
  role?: string;
  inviteUrl?: string;
  previewText: string;
}

const OrganizationInvitationEmail = ({
  inviterName = "John Doe",
  inviterEmail = "john@example.com",
  organizationName = "Acme Inc",
  role = "employee",
  inviteUrl = "https://example.com/invite/abc123",
  previewText,
}: OrganizationInvitationEmailProps) => {
  const roleDisplayName = role === "owner" ? "Owner" : "Employee";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto font-sans">
          <Container className="mx-auto my-10 max-w-[520px] bg-white p-5">
            <Section className="mb-10">
              <Img
                src={`${baseUrl}/static/tascboard.png`}
                width="60"
                height="60"
                alt="Tascboard Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              You&apos;ve been invited to join{" "}
              <strong>{organizationName}</strong>
            </Heading>

            <Text className="text-start text-sm">Hello,</Text>

            <Text className="text-start text-sm leading-relaxed">
              <strong>{inviterName}</strong> ({inviterEmail}) has invited you to
              join <strong>{organizationName}</strong> as a{" "}
              <strong>{roleDisplayName}</strong> on Tascboard.
            </Text>

            <Section className="my-8 w-full rounded-lg border bg-gray-50 p-6">
              <Row>
                <Column className="text-sm">
                  <Text className="m-0 mb-1 text-gray-600">Organization</Text>
                  <Text className="m-0 font-semibold text-gray-900">
                    {organizationName}
                  </Text>
                </Column>
              </Row>
              <Row className="mt-4">
                <Column className="text-sm">
                  <Text className="m-0 mb-1 text-gray-600">Role</Text>
                  <Text className="m-0 font-semibold text-gray-900">
                    {roleDisplayName}
                  </Text>
                </Column>
              </Row>
              <Row className="mt-4">
                <Column className="text-sm">
                  <Text className="m-0 mb-1 text-gray-600">Invited by</Text>
                  <Text className="m-0 font-semibold text-gray-900">
                    {inviterName}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Button
              href={inviteUrl}
              className="my-8 w-full rounded-md bg-blue-600 py-3 text-center text-white"
            >
              Accept Invitation
            </Button>

            <Text className="text-start text-sm leading-relaxed text-gray-600">
              This invitation will expire in 7 days. If you didn&apos;t expect
              this invitation, you can safely ignore this email.
            </Text>

            <Text className="text-start text-sm">
              Best regards,
              <br />
              The Tascboard Team
            </Text>
          </Container>

          <Text className="mx-auto max-w-[465px] px-4 text-center text-xs text-gray-500">
            Please do not reply to this email. We don&apos;t monitor responses
            sent to this address. Copyright © all rights reserved by Tascboard.
          </Text>

          <Section className="mx-auto max-w-[225px]">
            <Row className="text-center">
              <Column>
                <Text className="font-mono font-medium">Powered by</Text>
              </Column>
              <Column>
                <Img
                  src={`${baseUrl}/static/jb-portals.png`}
                  width="20"
                  height="20"
                  alt="JB Portals"
                  className=""
                />
              </Column>
              <Column>
                <Text className="font-mono font-medium">JB PORTALS</Text>
              </Column>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrganizationInvitationEmail;
