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

const userRepository = new UserRepository();
export class AuthController {
  async register(req: Request, res: Response): Promise<any> {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if user already exists
      const existingUser = await userRepository.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          data: null,
          message: "Email already in use",
        });
      }

      // Create new user
      const newUser = await userRepository.createUser({
        firstName,
        lastName,
        email,
        password,
        role: "user",
        active: true,
        loginAttempts: 0,
      });

      // Generate tokens
      const accessToken = generateAccessToken({
        id: newUser._id.toString(),
        role: newUser.role,
      });

      const refreshToken = generateRefreshToken({
        id: newUser._id.toString(),
      });
      console.error("accessToken", accessToken);
      // Store refresh token
      await userRepository.updateRefreshToken(
        newUser._id.toString(),
        refreshToken
      );

      // Set cookie with refresh token
      let cookie = res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // uncomment this lines when buy the mailgun sub
      // const emailVerificationToken = generateEmailVerificationToken();
      // await userRepository.updateEmailVerificationToken(
      //   newUser._id.toString(),
      //   emailVerificationToken
      // );
      // await sendVerificationEmail(email, emailVerificationToken);

      // console.log('cookies ....', cookie);

      // logger.info('cookies ....', cookie);
      // Send response
      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            accessToken,
          },
        },
        message: `User Register Successfully`,
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Registration error:", error);
      logger.error("Registration error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid credentials",
        });
      }

      // Check if account is locked
      const isLocked = await userRepository.isAccountLocked(user);
      if (isLocked) {
        return res.status(401).json({
          success: false,
          data: null,
          message:
            "Account locked. Please try again later or reset your password.",
        });
      }

      // Check password
      const isPasswordValid = await user.correctPassword(password);
      if (!isPasswordValid) {
        // Increment login attempts
        await userRepository.incrementLoginAttempts(user._id.toString());

        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid credentials",
        });
      }

      // Reset login attempts on successful login
      await userRepository.resetLoginAttempts(user._id.toString());

      // Generate tokens
      const accessToken = generateAccessToken({
        id: user._id.toString(),
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user._id.toString(),
        role: user.role,
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
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken,
          },
        },
        message: `User Login Successfully`,
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "Refresh token not found",
        });
      }

      // Check if token is blacklisted
      const isBlacklisted = await isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid refresh token",
        });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await userRepository.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "User not found",
        });
      }

      // Verify stored refresh token
      if (!user.refreshToken) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid refresh token",
        });
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken
      );
      if (!isRefreshTokenValid) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        id: user._id.toString(),
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        id: user._id.toString(),
        role: user.role,
      });

      // Update refresh token
      await userRepository.updateRefreshToken(
        user._id.toString(),
        newRefreshToken
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
        message: `Refresh token Successfully`,
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Refresh token error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        error: `error ${error.message}`,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<any> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        try {
          // Verify refresh token
          const decoded = verifyRefreshToken(refreshToken);

          // Invalidate refresh token in database
          await userRepository.updateRefreshToken(decoded.id, null);
          await redisClient.del(`user_${decoded.id.toString()}`);

          // Add refresh token to blacklist
          await addTokenToBlacklist(refreshToken, "7d");
        } catch (error) {
          // Continue logout process even if token verification fails
          console.error("Token verification error during logout:", error);
        }
      }

      // Get access token from Authorization header
      const authHeader = req.headers.authorization;
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
        message: "Logged out successfully",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      // Find user
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate reset token
      const resetToken = await userRepository.createPasswordResetToken(
        user._id.toString()
      );

      // In a real application, you would send an email with the reset link
      // For this example, we'll just return the token in the response
      sendPasswordResetEmail(email, resetToken);
      return res.status(200).json({
        success: true,
        message: "Password reset token sent to email",
        resetToken, // In production, don't send this in the response
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Forgot password error:", error);
      return res.status(500).json({
        success: false,
        drta: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { token, password } = req.body;

      // Find user with valid reset token
      const user = await userRepository.findUserByResetToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Invalid or expired token",
        });
      }

      // Update password
      await userRepository.updatePassword(user._id.toString(), password);

      // Invalidate all refresh tokens
      await userRepository.updateRefreshToken(user._id.toString(), null);

      return res.status(200).json({
        success: true,
        data: null,
        message: "Password reset successfully",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Reset password error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }
  async verifyEmail(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.params;

      // Find user by verification token
      const user = await userRepository.findUserByEmailVerificationToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      // Update user status to active and mark email as verified
      await userRepository.verifyEmail(user._id.toString());

      return res.status(200).json({
        success: true,
        data: null,
        message: "Email verified successfully. Your account is now active.",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Email verification error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "User not found",
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Email already verified",
        });
      }

      // Generate new verification token
      const emailVerificationToken = generateEmailVerificationToken();

      // Update user's verification token
      await userRepository.updateEmailVerificationToken(
        user._id.toString(),
        emailVerificationToken
      );

      // Send verification email``
      await sendVerificationEmail(email, emailVerificationToken);

      return res.status(200).json({
        success: true,
        data: null,
        message: "Verification email sent successfully",
      });
    } catch (err: unknown) {
      const error = err as IError;
      console.error("Resend verification email error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        error: `error ${error.message}`,
      });
    }
  }

  googleAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  };

  // Google OAuth callback
  googleCallback(req: Request, res: Response, next: NextFunction) {
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
        const email = profile.emails?.[0].value;
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
            firstName: profile.name?.givenName || "Google",
            lastName: profile.name?.familyName || "User",
            email,
            password: "google_oauth_dummy_password", // dummy password
            role: "user",
            active: true,
            loginAttempts: 0,
          });

          const verificationToken = generateEmailVerificationToken();
          await sendVerificationEmail(email, verificationToken); // optional
        }

        const accessToken = generateAccessToken({
          id: user._id.toString(),
          role: user.role,
        });
        const refreshToken = generateRefreshToken({ id: user._id.toString() });

        await userRepository.updateRefreshToken(
          user._id.toString(),
          refreshToken
        );

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
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
}

export default new AuthController();
