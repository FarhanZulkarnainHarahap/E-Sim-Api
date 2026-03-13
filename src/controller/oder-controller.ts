import { OrderStatus } from "@/generated/prisma/enums";
import type { Request, Response } from "express";
import { prisma } from "@/configs/prisma";

type OrderParams = {
  id: string;
};

type MarkOrderPaidBody = {
  paymentRef?: string;
};

export async function checkout(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        country: true,
        plan: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart kosong" });
    }

    const totalAmountIdr = cartItems.reduce(
      (total, item) => total + item.totalPriceIdr,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmountIdr,
          items: {
            create: cartItems.map((item) => ({
              countryName: item.country.name,
              countrySlug: item.country.slug,
              countryFlag: item.country.flagUrl,
              planTitle: item.plan.title,
              planSublabel: item.plan.sublabel,
              quantity: item.quantity,
              activationDate: item.activationDate,
              unitPriceIdr: item.unitPriceIdr,
              totalPriceIdr: item.totalPriceIdr,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return createdOrder;
    });

    return res.status(201).json({
      message: "Checkout berhasil, order dibuat",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function getOrderById(req: Request<OrderParams>, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    return res.json({
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function markOrderPaid(
  req: Request<OrderParams, {}, MarkOrderPaidBody>,
  res: Response,
) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { paymentRef } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.status === OrderStatus.PAID) {
      return res.status(400).json({ message: "Order sudah dibayar" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.PAID,
        paymentRef: paymentRef ?? `PAY-${Date.now()}`,
      },
      include: {
        items: true,
      },
    });

    return res.json({
      message: "Order berhasil ditandai paid",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function cancelOrder(req: Request<OrderParams>, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.status === OrderStatus.PAID) {
      return res
        .status(400)
        .json({ message: "Order yang sudah dibayar tidak bisa dibatalkan" });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).json({ message: "Order sudah dibatalkan" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        items: true,
      },
    });

    return res.json({
      message: "Order berhasil dibatalkan",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}
