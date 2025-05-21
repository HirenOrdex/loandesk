import nodemailer from "nodemailer";
import {
  createVerificationUrl,
  createPasswordResetUrl,
} from "../utils/emailUtils";
import {
  APP_URL,
  NODE_ENV,
  SMTP_USER,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
} from "../configs/envConfigs";
import { logger } from "../configs/winstonConfig";

const createTransporter = async () => {
  if (NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587"),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
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
  userId:string,
  email: string,
  token: string
): Promise<void> => {
  try {
    const verificationUrl = createVerificationUrl(userId,token, APP_URL);

    await sendEmail({
      from: SMTP_USER || '"Support" <support@example.com>',
      to: email,
      subject: "Verify Your Email Address",
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h3>Email Verification</h3>
          <p>Thank you for signing up! Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
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
      from: SMTP_USER || '"Support" <support@example.com>',
      to: email,
      subject: "Reset Your Password",
      text: `Please reset your password by clicking the following link: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h3>Password Reset</h3>
          <p>You requested to reset your password. Please click the button below to proceed:</p>
          <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
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
      from: SMTP_USER || '"Support" <support@example.com>',
      to: email,
      subject: "Welcome to Our Platform!",
      text: `Hi ${name}, thank you for verifying your email. Your account is now fully active.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h3>Welcome!</h3>
          <p>Hi ${name},</p>
          <p>Your email has been successfully verified, and your account is now active. Welcome aboard!</p><br/>
          <a href="${APP_URL}/sign-in" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Go to Login</a>
        </div>
      `,
    });
  } catch (error) {
    logger.error(`Error sending welcome email: ${error}`);
  }
}
export const sendUploadReminderEmail = async (
  recipientEmail: string,
  recipientName: string,
  bankerName: string,
  bankerCompany: string
): Promise<void> => {
  try {
    const uploadLink = `${APP_URL}/uploadDashboard/`;

    const emailHtml = `
      <div style="margin-top: 20px;">
        <p>Dear ${recipientName},</p>
      </div>
      <div>
        <p style="text-align: justify;">
          Your banker, <span style="text-transform: capitalize;">${bankerName}</span> with 
          <span style="text-transform: capitalize;">${bankerCompany}</span> is using LoanHeads.com to facilitate your loan request.
          Please upload your financial statements by 
          <a href="${uploadLink}" style="color: #000;">clicking here</a> or copying and pasting the URL below into your browser to complete your request:
        </p>
        <a href="${uploadLink}" style="color: #000;">${uploadLink}</a>
        <p>Your default username is your e-mail address.</p>
        <p>Your Password is same which you have been using previously.</p>
        <p>Please be sure to review your profile to ensure all information is correct.</p>
        <p>Once logged in, you can click on each highlighted box to upload the missing document.</p>
        <p>For technical support, please e-mail <a href="mailto:uploadsupport@loanheads.com">uploadsupport@loanheads.com</a>.</p>
        <p>Thank You from LoanHeads.com.</p>
      </div>
    `;

    await sendEmail({
      from: process.env.SMTP_USER || '"Support" <support@loanheads.com>',
      to: recipientEmail,
      subject: "Reminder: Upload Your Financial Documents",
      html: emailHtml,
    });

    logger.info(`✅ Upload reminder email sent to ${recipientEmail}`);
  } catch (error) {
    logger.error(`❌ Error sending upload reminder email: ${error}`);
    throw error;
  }
};
