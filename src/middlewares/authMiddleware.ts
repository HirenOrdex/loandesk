// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, isTokenBlacklisted } from '../utils/jwtUtils';
import { UserRepository } from '../repositories/userRepository';

// // Extend Express Request interface to include user property
interface CustomUser {
  id: string;
  role: string;
  // add anything else your app uses
}

interface AuthRequest extends Request {
  user?: CustomUser;
}

const userRepo = new UserRepository();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
):  Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    let token: string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];

      try {
        // Try to verify access token
        const decoded = verifyAccessToken(token);

        // Check if token is blacklisted
        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
           res.status(401).json({
            status: 'error',
            data: null,
            message: 'Invalid token. Please log in again.',
          });
          return
        }

        // Check if user exists
        const user = await userRepo.findUserById(decoded.id);
        if (!user) {
           res.status(401).json({
            status: 'error',
            data: null,
            message: 'User no longer exists.',
          });
          return
        }

        // Grant access
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };

        next();
      } catch (error: any) {
        // Only handle expired token error, other errors should return 401
        if (error.name === 'TokenExpiredError') {
          // Access token is expired, try refresh token
          const refreshToken = req.headers.cookie
            ?.split(';')
            .find((cookie) => cookie.trim().startsWith('refreshToken='))
            ?.split('=')[1];

          if (!refreshToken) {
             res.status(401).json({
              status: 'error',
              data: null,
              message: 'Session expired. Please log in again.',
            });
            return
          }

          try {
            // Verify refresh token
            const refreshDecoded = verifyRefreshToken(refreshToken);

            // Check if refresh token is blacklisted
            const isBlacklisted = await isTokenBlacklisted(refreshToken);
            if (isBlacklisted) {
               res.status(440).json({
                status: 'error',
                data: null,
                message: 'Invalid refresh token. Please log in again.',
              });
              return
            }

            // Check if user still exists
            const user = await userRepo.findUserById(refreshDecoded.id);
            if (!user) {
               res.status(440).json({
                status: 'error',
                data: null,
                message: 'User no longer exists.',
              });
              return
            }

            // Grant access
            req.user = {
              id: refreshDecoded.id,
              role: refreshDecoded.role,
            };

            next();
          } catch (refreshError) {
             res.status(440).json({
              status: 'error',
              data: null,
              message: 'Invalid refresh token. Please log in again.',
            });
            return
          }
        } else {
          // For any other token error (invalid signature, malformed, etc)
           res.status(401).json({
            status: 'error',
            data: null,
            message: 'Invalid token. Please log in again.',
          });
          return
        }
      }
    } else {
       res.status(401).json({
        status: 'error',
        data: null,
        message: 'Not authenticated. Please log in.',
      });return
    }
  } catch (error) {
     res.status(401).json({
      status: 'error',
      data: null,
      message: 'Not authenticated. Please log in.',
    });
    return
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        data: null,
        message: 'Not authenticated. Please log in.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        data: null,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

export const rateLimiter = (requests: number, timeWindowInMinutes: number) => {
  const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const resetTime = now + timeWindowInMinutes * 60 * 1000;

    if (!ipRequestMap.has(ip)) {
      ipRequestMap.set(ip, { count: 1, resetTime });
      next();
      return;
    }

    const ipData = ipRequestMap.get(ip)!;

    if (now > ipData.resetTime) {
      ipRequestMap.set(ip, { count: 1, resetTime });
      next();
      return;
    }

    ipData.count += 1;

    if (ipData.count > requests) {
      return res.status(429).json({
        status: 'error',
        data: null,
        message: `Too many requests. Please try again after ${Math.ceil(
          (ipData.resetTime - now) / 1000 / 60,
        )} minutes.`,
      });
    }

    next();
  };
};
