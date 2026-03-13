import type { Request, Response } from "express";
import { prisma } from "@/configs/prisma";
import { CustomJwtPayload } from "@/types/express.js";
import jwt from "jsonwebtoken";

export async function getUserProfile(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized. No token provided." });
      return;
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized. Invalid token." });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}

type UserParams = {
  id: string;
};

export async function getUserById(req: Request<UserParams>, res: Response) {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}
