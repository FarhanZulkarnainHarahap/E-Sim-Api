import express from "express";

import { verifyToken } from "../middleware/auth-middleware.js";
import { getUserProfile } from "@/controller/user-controller.js";

const router = express.Router();

// endpoint: GET /api/users/profile
router.route("/profile").get(verifyToken, getUserProfile);
export default router;
