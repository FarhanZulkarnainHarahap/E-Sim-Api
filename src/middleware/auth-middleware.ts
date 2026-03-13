import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// Pastikan Anda menyimpan CLIENT_ID di .env

type CustomJwtPayload = {
  id: string;
  role?: string;
};

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;
    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

export function roleGuard(...roles: string[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (roles.includes(user?.role)) {
      next();
      return;
    }

    res.status(403).json({ message: "Unauthorized access" });
  };
}
