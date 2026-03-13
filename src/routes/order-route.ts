import { Router } from "express";

import { verifyToken } from "@/middleware/auth-middleware";
import { checkout, getOrders, getOrderById, markOrderPaid, cancelOrder } from "@/controller/oder-controller";


const router = Router();

router.use(verifyToken);

router.post("/checkout", checkout);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/pay", markOrderPaid);
router.patch("/:id/cancel", cancelOrder);

export default router;