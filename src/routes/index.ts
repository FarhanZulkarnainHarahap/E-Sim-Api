import { Router } from "express";
import authRoutes from "./auth-route";
import countryRoutes from "./country-route";
import cartRoutes from "./cart-route";
import orderRoutes from "./order-route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/countries", countryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;