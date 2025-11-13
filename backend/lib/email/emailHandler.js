import nodemailer from "nodemailer";
import ENV from "../lib/ENV.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: ENV.NODE_ENV === "production" ? true : false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function sendWelcomeEmail({ sendTo, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
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