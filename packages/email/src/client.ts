import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeEmail } from "./templates/welcome-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const html = await render(react);
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: `Welcome ${name}! 🚀`,
    react: WelcomeEmail({ name }),
  });
}
