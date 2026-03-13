import type { Request, Response } from "express";
import { prisma } from "@/configs/prisma";

type CartParams = {
  id: string;
};

type AddToCartBody = {
  countryId: string;
  planId: string;
  quantity?: number;
  activationDate?: string | null;
};

type UpdateCartBody = {
  quantity?: number;
  activationDate?: string | null;
};

function parseActivationDate(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "INVALID_DATE";
  }

  return date;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function getCart(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        country: true,
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalAmountIdr = items.reduce(
      (total, item) => total + item.totalPriceIdr,
      0,
    );

    return res.json({
      data: {
        items,
        totalAmountIdr,
      },
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function addToCart(
  req: Request<{}, {}, AddToCartBody>,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { countryId, planId, quantity = 1, activationDate } = req.body;

    if (!isNonEmptyString(countryId) || !isNonEmptyString(planId)) {
      return res
        .status(400)
        .json({ message: "countryId dan planId wajib diisi" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity harus berupa angka dan minimal 1" });
    }

    const parsedActivationDate = parseActivationDate(activationDate);

    if (parsedActivationDate === "INVALID_DATE") {
      return res.status(400).json({ message: "activationDate tidak valid" });
    }

    const [country, plan] = await Promise.all([
      prisma.country.findUnique({
        where: { id: countryId },
      }),
      prisma.plan.findUnique({
        where: { id: planId },
      }),
    ]);

    if (!country) {
      return res.status(404).json({ message: "Negara tidak ditemukan" });
    }

    if (!plan) {
      return res.status(404).json({ message: "Paket tidak ditemukan" });
    }

    const unitPriceIdr = plan.priceIdr;
    const totalPriceIdr = unitPriceIdr * quantity;

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        countryId,
        planId,
        quantity,
        activationDate:
          parsedActivationDate === undefined ? null : parsedActivationDate,
        unitPriceIdr,
        totalPriceIdr,
      },
      include: {
        country: true,
        plan: true,
      },
    });

    return res.status(201).json({
      message: "Item berhasil ditambahkan ke cart",
      data: cartItem,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function updateCartItem(
  req: Request<CartParams, {}, UpdateCartBody>,
  res: Response,
) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity, activationDate } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      quantity !== undefined &&
      (!Number.isInteger(quantity) || quantity <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "Quantity harus berupa angka dan minimal 1" });
    }

    const parsedActivationDate = parseActivationDate(activationDate);

    if (parsedActivationDate === "INVALID_DATE") {
      return res.status(400).json({ message: "activationDate tidak valid" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        plan: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item cart tidak ditemukan" });
    }

    const nextQuantity = quantity ?? cartItem.quantity;
    const nextActivationDate =
      parsedActivationDate === undefined
        ? cartItem.activationDate
        : parsedActivationDate;

    const updated = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity: nextQuantity,
        activationDate: nextActivationDate,
        unitPriceIdr: cartItem.plan.priceIdr,
        totalPriceIdr: cartItem.plan.priceIdr * nextQuantity,
      },
      include: {
        country: true,
        plan: true,
      },
    });

    return res.json({
      message: "Cart berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("updateCartItem error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function deleteCartItem(req: Request<CartParams>, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item cart tidak ditemukan" });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return res.json({
      message: "Item cart berhasil dihapus",
    });
  } catch (error) {
    console.error("deleteCartItem error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.json({
      message: "Cart berhasil dikosongkan",
    });
  } catch (error) {
    console.error("clearCart error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}
