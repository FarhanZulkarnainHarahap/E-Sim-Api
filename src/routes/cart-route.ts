import { Router } from "express";

import { verifyToken } from "@/middleware/auth-middleware";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/controller/cart-controller";

const router = Router();

router.use(verifyToken);
router.route("/").get(getCart).post(addToCart).delete(clearCart);
router.route("/:id").patch(updateCartItem).delete(deleteCartItem);

export default router;
