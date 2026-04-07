import nodemailer from "nodemailer";
import CONFIG from "../config";
import { ExternalServiceError } from "./errors";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function buildTransport() {
  return nodemailer.createTransport({
    host: CONFIG.smtpHost,
    port: CONFIG.smtpPort,
    secure: CONFIG.smtpPort === 465,
    auth: {
      user: CONFIG.smtpAuthUser,
      pass: CONFIG.smtpAuthPass,
    },
  });
}

const transport = buildTransport();

export async function sendMail({ to, subject, text, html }: MailInput) {
  const from = CONFIG.senderEmail;

  try {
    return await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch {
    throw new ExternalServiceError(
      "Email delivery failed. Check SMTP credentials and sender configuration.",
    );
  }
}
