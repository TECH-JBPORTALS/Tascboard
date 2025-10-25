import {
  Body,
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

interface OtpVerificationEmailProps {
  email?: string;
  company?: string;
  otp: string;
  previewText: string;
}

const OtpVerificationEmail = ({
  email = "example@domain.com",
  company = "Tascboard",
  otp = "728938",
  previewText,
}: OtpVerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto font-sans">
          <Container className="mx-auto my-10 max-w-[465px] bg-white p-5">
            <Section className="mb-10">
              <Img
                src={`${baseUrl}/static/tascboard.png`}
                width="60"
                height="60"
                alt="Logo Example"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Verify your <strong>{company}</strong> sign in
            </Heading>
            <Text className="text-start text-sm">Hello {email},</Text>
            <Text className="text-start text-sm leading-relaxed">
              {"We've"} recieved a sign in attempt with the following code.
              Please enter it where you attempt to signing in for {company}
            </Text>

            <Section className="bg-gray-100 py-5">
              <Heading className="text-center font-mono text-4xl tracking-widest text-gray-600">
                {otp}
              </Heading>
            </Section>

            <Text className="text-start text-sm leading-relaxed">
              If you {"didn't"} attempt to sign in but recieved this email,
              please disregard it. The code will remail active for 5 minutes,
              for security reasons please do not share this code with anyone.
            </Text>

            <Text className="text-start text-sm">
              Namaste 🙏,
              <br />
              The {company} Team
            </Text>
          </Container>
          <Text className="mx-auto max-w-[465px] px-4 text-center text-xs text-gray-500">
            Please do not replay to this email we {"don't"} answer to any email
            if you did. Copyright © all reserved by {company}.
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

export default OtpVerificationEmail;
