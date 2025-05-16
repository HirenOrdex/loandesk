import crypto from 'crypto';
import { IError } from '../types/errorType';
import { logger } from '../configs/winstonConfig';

/**
 * Generate a secure random token for email verification
 * @returns {string} A hexadecimal string token
 */
export const generateEmailVerificationToken = (): string => {
  try {
    // Generate a random 32-byte buffer and convert to hex
    return crypto.randomBytes(32).toString('hex');
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error generating email verification token: ${error.message}`);
    throw new Error(`Error generating email verification token: ${error.message}`);
  }
};

/**
 * Generate a reset password token
 * @returns {string} A hexadecimal string token
 */
export const generatePasswordResetToken = (): string => {
  try {
    return crypto.randomBytes(32).toString('hex');
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error generating password reset token: ${error.message}`);
    throw new Error(`Error generating password reset token: ${error.message}`);
  }
};

/**
 * Hash a token for secure storage in the database
 * @param {string} token - The plain token to hash
 * @returns {string} The hashed token
 */
export const hashToken = (token: string): string => {
  try {
    return crypto.createHash('sha256').update(token).digest('hex');
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error hashing token: ${error.message}`);
    throw new Error(`Error hashing token: ${error.message}`);
  }
};

/**
 * Create a verification URL with the token
 * @param {string} token - The verification token
 * @param {string} baseUrl - The base URL of the application
 * @returns {string} The complete verification URL
 */
export const createVerificationUrl = (userId:string,token: string, baseUrl: string): string => {
  try {
    return `${baseUrl}/verify-email/${userId}/${token}`;
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error creating verification URL: ${error.message}`);
    throw new Error(`Error creating verification URL: ${error.message}`);
  }
};

/**
 * Create a password reset URL with the token
 * @param {string} token - The password reset token
 * @param {string} baseUrl - The base URL of the application
 * @returns {string} The complete reset URL
 */
export const createPasswordResetUrl = (token: string, baseUrl: string): string => {
  try {
    return `${baseUrl}/reset-password?token=${token}`;
  } catch (err: unknown) {
    const error = err as IError;
    logger.error(`Error creating password reset URL: ${error.message}`);
    throw new Error(`Error creating password reset URL: ${error.message}`);
  }
};
