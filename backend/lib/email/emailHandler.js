import nodemailer from "nodemailer";
import env from "../env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.NODE_ENV === "production" ? true : false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export default async function sendWelcomeEmail({
  sendTo,
  subject,
  text,
  html,
}) {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_USER,
      to: sendTo,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error Sending email: ", error);
    return { success: false, error: error.message };
  }
}
