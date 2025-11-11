import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { env } from "@/env";
import { Resend } from "resend";
import OrganizationInvitation from "@/emails/organization-invitation";
import { employee, owner, ac } from "./permissions";
import { invitation } from "@/server/db/auth-schema";
import { eq } from "drizzle-orm";
import EmailVerificationEmail from "@/emails/email-verification";
import OtpVerificationEmail from "@/emails/otp-verification";

const resend = new Resend(env.RESEND_API_KEY);

const baseURL =
  env.VERCEL_ENV === "production"
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tascboard",
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  trustedOrigins: [baseURL, "https://*.vercel.app"],
  plugins: [
    emailOTP({
      disableSignUp: true,
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP(data) {
        const { otp, email, type } = data;

        if (type == "email-verification") {
          const subject = `Your verification code is ${otp}`;
          const { error } = await resend.emails.send({
            from: "Tascboard <send@resend.jbportals.com>",
            to: [email],
            subject,
            react: (
              <EmailVerificationEmail
                previewText={subject}
                otp={otp}
                email={email}
              />
            ),
          });

          if (error)
            throw new Error(`Can't able to send code to this email right now`);
        }

        if (type == "sign-in") {
          const subject = `Your verification code is ${otp}`;
          const { error } = await resend.emails.send({
            from: "Tascboard <send@resend.jbportals.com>",
            to: [email],
            subject,
            react: (
              <OtpVerificationEmail
                previewText={subject}
                otp={otp}
                email={email}
              />
            ),
          });

          if (error)
            throw new Error(`Can't able to send code to this email right now`);
        }
      },
    }),
    organization({
      ac,
      roles: {
        owner,
        employee,
      },
      creatorRole: "owner",
      organizationLimit: 1,
      allowUserToCreateOrganization: false,
      disableOrganizationDeletion: true,
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail(data) {
        // Extract data from the invitation object
        const inviter = data.inviter;
        const organization = data.organization;
        const invitation = data.invitation;

        if (!inviter || !organization || !invitation) {
          throw new Error("Failed to fetch invitation details");
        }

        const inviteUrl = `${baseURL}/accept-invitation/${invitation.id}`;
        const subject = `You've been invited to join ${organization.name}`;
        const roleDisplayName = data.role === "owner" ? "Owner" : "Employee";

        const { error } = await resend.emails.send({
          from: "Tascboard <send@resend.jbportals.com>",
          to: [data.email],
          subject,
          react: (
            <OrganizationInvitation
              previewText={subject}
              inviterName={inviter.user.name}
              inviterEmail={inviter.user.email}
              organizationName={organization.name}
              role={roleDisplayName}
              inviteUrl={inviteUrl}
            />
          ),
        });

        if (error) {
          throw new Error("Failed to send invitation email");
        }
      },
      organizationHooks: {
        async afterCancelInvitation(data) {
          await db
            .delete(invitation)
            .where(eq(invitation.id, data.invitation.id));
        },
        async afterAcceptInvitation(data) {
          await db
            .delete(invitation)
            .where(eq(invitation.id, data.invitation.id));
        },
      },
    }),
    nextCookies(),
  ],
});

export type Auth = typeof auth;

/** Get session in server environment */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getFullOrganization() {
  return auth.api.getFullOrganization({ headers: await headers() });
}

export async function setActiveOrganization() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId: organizations[0]?.id,
      organizationSlug: organizations[0]?.slug,
    },
  });
}
