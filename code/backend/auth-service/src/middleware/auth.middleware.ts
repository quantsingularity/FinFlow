import { Request, Response, NextFunction } from "express";
import passport from "passport";
// Authentication middleware using JWT
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  })(req, res, next);
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ message: "Unauthorized: Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role as string)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }

    next();
  };
};

// Admin-only authorization middleware
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: Authentication required" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden: Admin access required" });
    return;
  }

  next();
};

export default {
  authenticate,
  authorize,
  authorizeAdmin,
};
