// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  addTokenToBlacklist,
  isTokenBlacklisted,
} from "../utils/jwtUtils";
import { redisClient } from "../utils/redisClient";
import bcrypt from "bcryptjs";
import { APP_URL, NODE_ENV } from "../configs/envConfigs";
import { UserRepository } from "../repositories/userRepository";
import { generateEmailVerificationToken } from "../utils/emailUtils";
import passport from "passport";
import { IError } from "../types/errorType";
import { logger } from "../configs/winstonConfig";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/emailService";
import { generateOTP, verifyOTP } from "../utils/otpUtils";
import otpRepository from "../repositories/otpRepository";
import { BankerRepossitory } from "../repositories/bankerRepository";
import { IBankerRegistration } from "../models/BankerModel";
import { IAddress } from "../models/AddressModel";
import deviceRepository from "../repositories/deviceRepository";
import { extractDeviceInfo } from "../utils/deviceUtils";
import { BorrowerRepository } from "../repositories/borrowerRepository";
import UserModel from "../models/User";
import { Console } from "winston/lib/winston/transports";
import { IUser } from "../types/userType";
import { UpdateUser } from "../types/auth.type";

const userRepository = new UserRepository();
const controllerName: string = "authController";
const bankerRepository = new BankerRepossitory();
const borrowerRepository = new BorrowerRepository();
export class AuthController {
  async register(req: Request, res: Response): Promise<any> {
    const functionName = "register";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);

    const type = req?.query?.type;
    logger.info(`Registering ${type}: ${JSON.stringify(req?.body)}`);

    try {
      const { email, password, confirm_password } = req?.body;

      // Check if user already exists
      const existingUser = await userRepository.findUserByEmail(email);
      if (existingUser) {
        logger.info(`Email already in use`);
        return res.status(409).json({
          success: false,
          data: null,
          message:
            "The email address entered is already registered. Please try again with new email or contact the support team.",
          error:
            "The email address entered is already registered. Please try again with new email or contact the support team.",
        });
      }
      if (password !== confirm_password) {
        logger.info(`confirm Password and Password Should be same`);
        return res.status(400).json({
          success: false,
          data: null,
          message: `confirm Password and Password Should be same`,
          error: `confirm Password and Password Should be same`,
        });
      }
      // BANKER TYPE
      if (type === "banker") {
        const {
          financialInstitutionName,
          firstName,
          middleInitial,
          lastName,
          phone,
          title,
          areaOfSpecialty,
          address,
          bankType,
          assetSize,
        } = req?.body;

        // Validate required fields
        if (
          !financialInstitutionName ||
          !email ||
          !password ||
          !firstName ||
          !lastName ||
          !phone ||
          !address
        ) {
          return res.status(400).json({
            success: false,
            data: null,
            message: "Missing required fields",
            error: "Missing required fields",
          });
        }

        try {
          const hashedPassword = await bankerRepository.hashPassword(password);
          const roleId = await userRepository.findRoleIdByName("Banker");
          // Create the banker
          console.log("roleId", roleId);
          const { newUser, newBanker, newAddress } =
            (await bankerRepository.createBanker({
              financialInstitutionName,
              email,
              password: hashedPassword,
              firstName,
              middleInitial,
              lastName,
              phone,
              roleId,
              title,
              areaOfSpecialty,
              address,
              bankType,
              assetSize,
            })) as unknown as {
              newUser: IUser & Document;
              newBanker: IBankerRegistration & Document;
              newAddress: (IAddress & Document) | null;
            };

          const accessToken = generateAccessToken({
            id: newUser?._id.toString(),
            role: "Banker",
          });

          const refreshToken = generateRefreshToken({
            id: newUser?._id.toString(),
          });

          await userRepository.updateRefreshToken(
            newUser?._id.toString(),
            refreshToken
          );

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          const emailVerificationToken = generateEmailVerificationToken();
          await userRepository.updateEmailVerificationToken(
            newUser?._id.toString(),
            emailVerificationToken
          );
          await sendVerificationEmail(email, emailVerificationToken);

          return res.status(201).json({
            success: true,
            data: {
              id: newUser?._id,
              email: newUser?.email,
              name: newUser?.firstName,
            },
            message: "Banker created successfully",
            error: null,
          });
        } catch (error: unknown) {
          const err = error as Error;
          logger.error(`Error creating banker: ${err.message}`);
          return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error",
            error: err?.message,
          });
        }
      } else if (type === "borrower") {
        try {
          const {
            email,
            password,
            confirm_password,
            firstName,
            lastName,
            phone,
            coname,
            position,
            other_position,
            captchaCode
          } = req?.body;

          // Validate passwords
          if (password !== confirm_password) {
            logger.info(`Passwords do not match`);

            return res.status(400).json({
              success: false,
              data: null,
              message: "Passwords do not match",
              error: "Passwords do not match",
            });
          }

          // Check if user already exists
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            logger.info(`User Already Exists`);

            return res.status(409).json({
              success: false,
              data: null,
              message:
                "The email address entered is already registered. Please try again with new email or contact the support team.",
              error:
                "The email address entered is already registered. Please try again with new email or contact the support team.",
            });
          }
          const roleId = await userRepository.findRoleIdByName("Banker");

          // Create user
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            roleId: roleId, // Replace or pass dynamically
            status: "active",
            loginAttempts: 0,
          });
          // Create borrower record
          const newBorrower = await borrowerRepository.createBorrower({
            userId: newUser?._id,
            coname,
            position,
            other_position,
            createdBy: newUser?._id,
          });
          const emailVerificationToken = generateEmailVerificationToken();
          await userRepository.updateEmailVerificationToken(
            newUser?._id.toString(),
            emailVerificationToken
          );
          await sendVerificationEmail(email, emailVerificationToken);

          return res.status(201).json({
            success: true,
            message: "Borrower created successfully",
            data: {
              id: newUser?._id,
              email: newUser?.email,
              name: newUser?.firstName,
            },
            error: null,
          });
        } catch (error) {
          console.error("Error creating borrower:", error);
          return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error",
            error: "Internal Server Error",
          });
        }
      } else {
        logger.error(`Unsupported user type: ${type}`);
        // FUTURE: Other user types like borrower, admin etc.
        return res.status(400).json({
          success: false,
          data: null,
          message: `Unsupported user type: ${type}`,
          error: null,
        });
      }
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("Registration error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        data: null,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async sendLoginOtp(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req?.body;
      const functionName = "sendLoginOtp";
      logger.info(`Coming into Controller ${controllerName}`);
      logger.info(`Coming into function ${functionName}`);

      // Find user
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        logger.info(`Invalid credentials`);
        return res.status(401).json({
          success: false,
          data: null,
          error: "Cannot Process Request. Username does not exists",
          message: "Cannot Process Request. Username does not exists",
        });
      }
      if (user?.isEmailVerified === false) {
        logger.info(`Email is not verified, please verify your email.`);
        return res.status(400).json({
          success: false,
          data: null,
          error:
            "Account is not verified. Please check your email & complete verification process.",
          message:
            "Account is not verified. Please check your email & complete verification process.",
        });
      }
      // Check if account is locked
      const isLocked = await userRepository.isAccountLocked(user);
      if (isLocked) {
        logger.info(
          `Account locked. Please try again later or reset your password.`
        );
        return res.status(401).json({
          success: false,
          data: null,
          error:
            "Account locked. Please try again later or reset your password.",
          message:
            "Account locked. Please try again later or reset your password.",
        });
      }

      // Check password
      const isPasswordValid = await user.correctPassword(password);
      if (!isPasswordValid) {
        logger.info(`Invalid credentials Password`);
        await userRepository.incrementLoginAttempts(user?._id.toString());
        return res.status(401).json({
          success: false,
          data: null,
          error: "Login Failed. Invalid Username or Password",
          message: "Login Failed. Invalid Username or Password",
        });
      }
      // send otp

      // Reset login attempts on successful login
      await userRepository.resetLoginAttempts(user?._id.toString());
      const deviceInfo = extractDeviceInfo(req);
      const phone = user?.phone;
      // Check if user already exists by phone or email
      if (phone) {
        const otp = await generateOTP(phone);
        const requestId = await otpRepository.storeOTP(
          phone,
          otp,
          user.id,
          email,
          "login"
        );

        // In production, send the OTP via SMS
        // For development, we'll log it
        logger.info(`Generated OTP for  existingUser  ${phone}: ${otp}`);

        // Store device info temporarily
        await deviceRepository.storeTemporaryDeviceInfo(requestId, deviceInfo);

        // Store registration data temporarily in Redis
        // await redisClient.set(
        //   `login_${requestId}`,
        //   JSON.stringify({
        //     phone,
        //     deviceInfo,
        //   }),
        //   { EX: 300 }
        // ); // 5 minutes expiry

        return res.status(200).json({
          success: true,
          message: `A text message with a 6-digit verification code was just sent to ${phone}`,
          data: {
            requestId,
            expiresIn: 300,
            // For development only, remove in production
            otp: NODE_ENV === "development" ? otp : undefined,
          },
          error: null,
        });
      }
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Send OTP error:", error);
      logger.error("Send OTP  error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error?.message}`,
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<any> {
    const functionName = "refreshToken";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      // Get refresh token from cookie
      const refreshToken: string = req?.cookies?.refreshToken;
      logger.info("refreshToken: Received refresh token request");

      if (!refreshToken) {
        logger.error("refreshToken: Refresh token not found in cookies.");
        return res.status(401).json({
          success: false,
          data: null,
          error: "Refresh token not found",
          message: "Refresh token not found",
        });
      }

      // Check if token is blacklisted
      const isBlacklisted: boolean = await isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Invalid refresh token",
          message: "Invalid refresh token",
        });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await userRepository?.findUserById(decoded.id);
      if (!user) {
        logger.error(`refreshToken: No user found with ID: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          data: null,
          error: "User not found",
          message: "User not found",
        });
      }

      // Verify stored refresh token
      if (!user?.refreshToken) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Invalid refresh token",
          message: "Invalid refresh token",
        });
      }

      const isRefreshTokenValid: boolean = await bcrypt.compare(
        refreshToken,
        user?.refreshToken
      );
      if (!isRefreshTokenValid) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Invalid refresh token",
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        id: user?._id.toString(),
        role: "Banker",
      });

      const newRefreshToken = generateRefreshToken({
        id: user?._id.toString(),
        role: "banker",
      });

      // Update refresh token
      await userRepository.updateRefreshToken(
        user._id.toString(),
        newRefreshToken
      );
      logger.info(
        `refreshToken: Refresh token updated for user ID: ${user._id}`
      );

      // Blacklist old refresh token
      await addTokenToBlacklist(refreshToken, "7d");

      // Set cookie with new refresh token
      let cookies = res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      logger.info("cookies .....", cookies);
      console.log("cookies .....", cookies);

      // Send response
      return res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
        error: null,
        message: `Refresh token Successfully`,
      });
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("Refresh token error:", error);
      console.error("Refresh token error:", error);
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid refresh token",
        error: `error ${error.message}`,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<any> {
    const functionName = "logout";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      // Get refresh token from cookie
      const refreshToken: string | undefined = req?.cookies?.refreshToken;

      if (refreshToken) {
        try {
          // Verify refresh token
          const decoded = verifyRefreshToken(refreshToken);

          // Invalidate refresh token in database
          await userRepository.updateRefreshToken(decoded.id, null);
          await redisClient.del(`user_${decoded.id.toString()}`);
          logger.info(`logout: Deleted cached data for user ID: ${decoded.id}`);

          // Add refresh token to blacklist
          await addTokenToBlacklist(refreshToken, "7d");
        } catch (error) {
          // Continue logout process even if token verification fails
          console.error("Token verification error during logout:", error);
          logger.error("Token verification error during logout:", error);
          return res.status(401).json({
            success: false,
            data: null,
            error: "Token verification error during logout.",
            message: "Token verification error during logout.",
          });
        }
      }

      // Get access token from Authorization header
      const authHeader: string | undefined = req?.headers?.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const accessToken = authHeader.split(" ")[1];

        // Add access token to blacklist
        await addTokenToBlacklist(accessToken, "15m");
      }

      // Clear refresh token cookie
      res.clearCookie("refreshToken");
      return res.status(200).json({
        success: true,
        data: null,
        error: null,
        message: "Logged out successfully",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Logout error:", error);
      logger.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<any> {
    const functionName = "forgotPassword";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      const { email } = req?.body;

      // Find user
      const user = await userRepository.findUserByEmail(email);
      logger.error(`forgotPassword: No user found with email: ${email}`);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Cannot Process Request. Username does not exists",
          message: "Cannot Process Request. Username does not exists",
        });
      }

      if (!user?.isEmailVerified) {
        logger.error(`forgotPassword: Email not verified for user: ${email}`);
        return res.status(400).json({
          success: false,
          data: null,
          error: "Cannot Process Request. User is not activated",
          message: "Cannot Process Request. User is not activated",
        });
      }
      // Generate reset token
      const resetToken: string = await userRepository.createPasswordResetToken(
        user?._id.toString()
      );

      // In a real application, you would send an email with the reset link
      // For this example, we'll just return the token in the response
      sendPasswordResetEmail(email, resetToken);
      console.log("Password reset token sent to email");
      logger.info("Password reset token sent to email");
      return res.status(200).json({
        success: true,
        data: null,
        error: null,
        message:
          "Email has been sent to your registered email Id. Please follow the steps to reset your password",
        resetToken, // In production, don't send this in the response
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Forgot password error:", error);
      logger.error("Forgot password error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<any> {
    const functionName = "resetPassword";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      const { token, password } = req?.body;
      logger.info(
        `resetPassword: Received password reset request with token: ${token}`
      );
      // Find user with valid reset token
      const user = await userRepository.findUserByResetToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Invalid or expired token",
          message: "Invalid or expired token",
        });
      }
      // Update password
      await userRepository.updatePassword(user?._id.toString(), password);
      logger.info(
        `resetPassword: Password updated successfully for user ID: ${user?._id}`
      );
      // Invalidate all refresh tokens
      await userRepository.updateRefreshToken(user?._id.toString(), null);

      return res.status(200).json({
        success: true,
        data: null,
        error: null,
        message: "Password reset successfully",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Reset password error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }
  async verifyEmail(req: Request, res: Response): Promise<any> {
    const functionName = "verifyEmail";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      const { token } = req?.params;
      logger.info("verifyEmail: Received request with token:", token);
      // Find user by verification token
      const user = await userRepository.findUserByEmailVerificationToken(token);
      if (!user) {
        logger.error("verifyEmail: Invalid or expired token");
        return res.status(400).json({
          success: false,
          data: null,
          error: "Invalid or expired verification token",
          message: "Invalid or expired verification token",
        });
      }
      const userId = user?._id;
      const isAlreadyVerified = await userRepository.isEmailAlreadyVerified(
        userId.toString()
      );

      if (isAlreadyVerified) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Email already verified.",
          message: "Email already verified.",
        });
      }
      // Update user status to active and mark email as verified
      await userRepository.verifyEmail(user?._id.toString());
      logger.info(
        `verifyEmail: Email verified successfully for user ID ${user?._id}`
      );

      return res.status(200).json({
        success: true,
        data: null,
        error: null,
        message: "Email verified successfully. Your account is now active.",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Email verification error:", error);
      logger.error("Email verification error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<any> {
    const functionName = "resendVerificationEmail";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      const { email } = req?.body;

      // Find user by email
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        logger.error(
          `resendVerificationEmail: User not found with email ${email}`
        );
        return res.status(404).json({
          success: false,
          data: null,
          error: "Error occured while invite User. Please contact support",
          message: "Error occured while invite User. Please contact support",
        });
      }

      if (user.isEmailVerified) {
        logger.error(
          `resendVerificationEmail: Email already verified for user ID ${user._id}`
        );
        return res.status(400).json({
          success: false,
          data: null,
          error:
            "User is already active. Please login to continue. Or use forgot password if you forgot the password. Else please contact support",
          message:
            "User is already active. Please login to continue. Or use forgot password if you forgot the password. Else please contact support",
        });
      }

      // Generate new verification token
      const emailVerificationToken = generateEmailVerificationToken();

      // Update user's verification token
      await userRepository.updateEmailVerificationToken(
        user?._id.toString(),
        emailVerificationToken
      );

      // Send verification email``
      await sendVerificationEmail(email, emailVerificationToken);
      logger.info(
        `resendVerificationEmail: Verification email sent to ${email}`
      );

      return res.status(200).json({
        success: true,
        data: null,
        error: null,
        message:
          "Done! We have resent an email with instructions on how to activate your account. Please check your inbox. If you still did not receive an email, please contact us at support@loandesk.com.",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Resend verification email error:", error);
      logger.error("Resend verification email error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const functionName = "googleAuth";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  }

  // Google OAuth callback
  async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const functionName = "googleCallback";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    passport.authenticate("google", async (err: any, profile: any) => {
      if (err || !profile) {
        console.error("OAuth failed:", err);
        return res.redirect(`${APP_URL}/google-login-failed`);
        //   return res.status(401).json({
        //     success: false,
        //     data: null,
        //     error: 'login failed.',
        //     message: 'login failed.',
        //   });
      }

      try {
        const email = profile?.emails?.[0].value;
        if (!email) {
          return res.status(401).json({
            success: false,
            data: null,
            error: "Email not found in Google profile.",
            message: "Email not found in Google profile.",
          });
        }

        // Check for existing user
        let user = await userRepository.findUserByEmail(email);
        if (!user) {
          // Create a new user
          user = await userRepository.createUser({
            firstName: profile?.name?.givenName || "Google",
            lastName: profile?.name?.familyName || "User",
            email,
            password: "google_oauth_dummy_password", // dummy password
            active: true,
            loginAttempts: 0,
          });

          const verificationToken = generateEmailVerificationToken();
          await sendVerificationEmail(email, verificationToken); // optional
        }

        const accessToken = generateAccessToken({
          id: user._id.toString(),
          role: "user",
        });
        const refreshToken = generateRefreshToken({ id: user._id.toString() });

        await userRepository.updateRefreshToken(
          user._id.toString(),
          refreshToken
        );

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to frontend with accessToken
        return res.redirect(
          `${APP_URL}/google-callback?accessToken=${accessToken}&firstName=${user.firstName}`
        );
        //  return res.status(200).json({
        //   success: true,
        //   data: {
        //     accessToken,
        //     firstName: user.firstName,
        //     role: user.role,
        //   },
        //   message: "Login successful.",
        //   error: null,
        // });
      } catch (error) {
        console.error("Google login error:", error);
        return res.status(500).json({
          success: false,
          data: null,
          message:
            "An error occurred during  continue with google. Please try again later.",
          error: `Error during continue with google: ${err.message}`,
        });
      }
    })(req, res, next);
  }

  async changePassword(req: Request, res: Response): Promise<any> {
    const functionName = "changePassword";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        logger.error("changePassword:-Refresh token missing in cookies.");
        console.error("changePassword:-Refresh token missing in cookies.");
        return res.status(401).json({
          success: false,
          data: null,
          error: "Unauthorized: Refresh token missing.",
          message: "Unauthorized: Refresh token missing.",
        });
      }
      // Verify token and extract userId
      let decoded: any;
      try {
        decoded = verifyRefreshToken(refreshToken); // This should return an object with `id`
      } catch (err) {
        logger.error("changePassword:-Invalid refresh token.");
        console.error("changePassword:-Invalid refresh token.");
        return res.status(401).json({
          success: false,
          data: null,
          error: "Invalid or expired refresh token.",
          message: "Invalid or expired refresh token.",
        });
      }
      const userId: string = decoded?.id;
      const isAlreadyVerified = await userRepository.isEmailAlreadyVerified(
        userId.toString()
      );

      if (!isAlreadyVerified) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Email is not verified, please verify your email.",
          message: "Email is not verified, please verify your email.",
        });
      }
      const { oldPassword, newPassword } = req.body;
      if (!(oldPassword && newPassword)) {
        logger.error(
          "changePassword: old password, and new password are required"
        );
        console.error(
          "changePassword: old password, and new password are required"
        );
        return res.status(400).json({
          success: false,
          data: null,
          error: "User ID, old password, and new password are required.",
          message: "User ID, old password, and new password are required.",
        });
      }

      //
      const updatePassword: UpdateUser | null = await UserModel.findOne({
        _id: userId,
      }).select("+password");

      if (!updatePassword?.password) {
        logger.error("changePassword:-Password is missing in the user record.");
        return res.status(500).json({
          success: false,
          data: null,
          error: "Password not found in user record.",
          message: "Password not found in user record.",
        });
      }

      const isMatch = await bcrypt?.compare(
        oldPassword,
        updatePassword?.password
      );
      if (!isMatch) {
        logger.error("changePassword:-Old password is incorrect.");
        console.error("changePassword:-Old password is incorrect.");
        return res.status(401).json({
          success: false,
          data: null,
          error: "Old password is incorrect.",
          message: "Old password is incorrect.",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const updateUser: UpdateUser | null = await UserModel.findByIdAndUpdate(
          userId,
          {
            password: hashedPassword,
            passwordChangedAt: new Date(),
            updatedBy: userId,
          },
          { new: true } // returns the updated document
        );

        if (updateUser) {
          await redisClient.del(`user_${userId}`);
          console.log("changePassword:-User password updated successfully.");
          logger.info("changePassword:-Password updated successfully.");
          return res.status(200).json({
            success: true,
            data: null,
            error: null,
            message: "Password updated successfully.",
          });
        } else {
          logger.error("changePassword:-Unable to update the password");
          return res.status(500).json({
            success: false,
            data: null,
            error: "Unable to update the password.",
            message: "Unable to update the password.",
          });
        }
      }
    } catch (err: any) {
      logger.error(err);
      return res.status(500).json({
        success: false,
        data: null,
        message: `An internal server error occurred.`,
        error: `changePassword:- An internal server error occurred. ${err?.message}`,
      });
    }
  }
  async login(req: Request, res: Response): Promise<any> {
    const functionName = "login";
    logger.info(`Coming into Controller ${controllerName}`);
    logger.info(`Coming into function ${functionName}`);

    try {
      const { email, otp } = req?.body;
      console.log("in login ");
      if (!email || !otp) {
        logger.info(`Email and OTP are required`);
        return res.status(400).json({
          success: false,
          data: null,
          message: "Email and On-Demand Code are required",
          error: "Email and On-Demand Code are required",
        });
      }
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        logger.info(`INvaild Credentials`);
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid credentials",
          error: "Invalid credentials",
        });
      }

      const otpData = await otpRepository.getOTP(email.toLowerCase(), "login");
      console.log("otp ", otpData);

      if (!otpData || otpData.type !== "login") {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Invalid or expired On-Demand Code",
          error: "Invalid or expired On-Demand Code",
        });
      }

      const isValid = verifyOTP(otp, otpData.otp);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Invalid On-Demand Code",
          error: "Invalid On-Demand Code",
        });
      }

      if (!otpData.userId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Reset request expired",
          error: "Reset request expired",
        });
      }
      console.log("roleId");
      if (user?.roleId) {
        const role = await userRepository.findRoleIdById(user?.roleId);
        // Generate tokens
        const accessToken = generateAccessToken({
          id: user._id.toString(),
          role: role,
        });

        const refreshToken = generateRefreshToken({
          id: user._id.toString(),
          role: role,
        });

        // Store refresh token
        await userRepository.updateRefreshToken(
          user._id.toString(),
          refreshToken
        );

        // Set cookie with refresh token
        let cookie = res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        await redisClient.set(
          `user_${user._id.toString()}`,
          JSON.stringify(user),
          {
            EX: 3600, // 1 hour
          }
        );
        // console.log("cookie",cookie)
        // Send response
        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: user?._id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              role: role,
              accessToken,
            },
          },
          message: `Login Successfully`,
          error: null,
        });
      }
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Error in verifyOtp:", error);
      logger.error("Error in verifyOtp:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Internal server error",
        error: `error ${error.message}`,
      });
    }
  }
  async resendLoginOtp(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;
      const functionName = "resendLoginOtp";
      logger.info(`Coming into Controller ${controllerName}`);
      logger.info(`Coming into function ${functionName}`);

      // Find user
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        logger.info(`Invalid credentials`);
        return res.status(401).json({
          success: false,
          data: null,
          error: "Cannot Process Request. Username does not exists",
          message: "Cannot Process Request. Username does not exists",
        });
      }
      if (user.isEmailVerified === false) {
        logger.info(`Email is not verified, please verify your email.`);
        return res.status(400).json({
          success: false,
          data: null,
          error:
            "Account is not verified. Please check your email & complete verification process.",
          message:
            "Account is not verified. Please check your email & complete verification process.",
        });
      }
      // Check if account is locked
      const isLocked = await userRepository.isAccountLocked(user);
      if (isLocked) {
        logger.info(
          `Account locked. Please try again later or reset your password.`
        );
        return res.status(401).json({
          success: false,
          data: null,
          error:
            "Account locked. Please try again later or reset your password.",
          message:
            "Account locked. Please try again later or reset your password.",
        });
      }

      // send otp

      // Reset login attempts on successful login
      await userRepository.resetLoginAttempts(user._id.toString());
      const deviceInfo = extractDeviceInfo(req);
      const phone = user.phone;
      // Check if user already exists by phone or email
      if (phone) {
        const otp = await generateOTP(phone);
        const requestId = await otpRepository.storeOTP(
          phone,
          otp,
          user.id,
          email,
          "login"
        );

        // In production, send the OTP via SMS
        // For development, we'll log it
        logger.info(`Generated OTP for  existingUser  ${phone}: ${otp}`);

        // Store device info temporarily
        await deviceRepository.storeTemporaryDeviceInfo(requestId, deviceInfo);

        // Store registration data temporarily in Redis
        // await redisClient.set(
        //   `login_${requestId}`,
        //   JSON.stringify({
        //     phone,
        //     deviceInfo,
        //   }),
        //   { EX: 300 }
        // ); // 5 minutes expiry

        return res.status(200).json({
          success: true,
          message: `on-Demand Code re-sent successfully`,
          data: {
            requestId,
            expiresIn: 300,
            // For development only, remove in production
            otp: NODE_ENV === "development" ? otp : undefined,
          },
          error: null,
        });
      }
    } catch (err: unknown) {
      const error = err as IError;
      logger.error("reSend OTP error:", error);
      console.error("reSend OTP error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }
}

export default new AuthController();
