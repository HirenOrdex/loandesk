import nodemailer from "nodemailer";
import {
  createVerificationUrl,
  createPasswordResetUrl,
} from "../utils/emailUtils";
import {
  APP_URL,
  NODE_ENV,
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from "../configs/envConfigs";
import { logger } from "../configs/winstonConfig";

const createTransporter = async () => {
  if (NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587"),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
};

const sendEmail = async (
  message: nodemailer.SendMailOptions
): Promise<void> => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(message);

    if (NODE_ENV === "development") {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    logger.info(`Email sent to ${message.to}`);
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    throw new Error("Failed to send email");
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const verificationUrl = createVerificationUrl(token, APP_URL);

    await sendEmail({
      from: SMTP_FROM || '"Support" <support@example.com>',
      to: email,
      subject: "Verify Your Email Address",
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Thank you for registering! Click below to verify your email:</p>
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>If that doesn’t work, use this link:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
      `,
    });

    logger.info(`Verification email sent to: ${email}`);
  } catch (error) {
    logger.error(`Error sending verification email to ${email}: ${error}`);
    throw error; // Re-throw the error after logging it
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const resetUrl = createPasswordResetUrl(token, APP_URL);

    await sendEmail({
      from: SMTP_FROM || '"Support" <support@example.com>',
      to: email,
      subject: "Reset Your Password",
      text: `Please reset your password by clicking the following link: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click below:</p>
          <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p>If that doesn’t work, use this link:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
        </div>
      `,
    });

    logger.info(`Password reset email sent to: ${email}`);
  } catch (error) {
    logger.error(`Error sending password reset email to ${email}: ${error}`);
    throw error; // Re-throw the error after logging it
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  try {
    await sendEmail({
      from: SMTP_FROM || '"Support" <support@example.com>',
      to: email,
      subject: "Welcome to Our Platform!",
      text: `Hi ${name}, thank you for verifying your email. Your account is now fully active.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome!</h2>
          <p>Hi ${name},</p>
          <p>Your email is verified and your account is active. Welcome aboard!</p>
          <a href="${APP_URL}/dashboard" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Go to Dashboard</a>
        </div>
      `,
    });
  } catch (error) {
    logger.error(`Error sending welcome email: ${error}`);
  }
};
