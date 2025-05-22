import twilio from 'twilio';
import { logger } from '../configs/winstonConfig';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '../configs/envConfigs';

// Load Twilio credentials from environment variables

// Create a Twilio client instance
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Sends an OTP via SMS using Twilio
 * @param phoneNumber The phone number to send the OTP to
 * @param otp The OTP to send
 * @returns Promise resolving to the message SID
 */
export const sendOtpViaSms = async (phoneNumber: string, otp: string): Promise<string> => {
  try {
    // Send the OTP via Twilio
    const message = await client.messages.create({
      body: `Your ALoanMatic OTP is ${otp}. Do not share it with anyone. Need help? Contact support`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    logger.info(`OTP sent successfully to ${phoneNumber}: ${message.sid}`);
    return message.sid;
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Error sending OTP via Twilio: ${err.message}`);
    throw new Error(`Error sending OTP via Twilio: ${err.message}`);
  }
};
