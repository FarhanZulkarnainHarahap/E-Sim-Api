import "express";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?;
    }
  }
}

export {};
