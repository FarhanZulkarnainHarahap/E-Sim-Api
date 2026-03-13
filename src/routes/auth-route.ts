import { login, logout } from "@/controller/auth-controller";
import { register } from "@/controller/register-controller";
import express from "express";

const router = express.Router();

// endpoint: POST /api/auth/register
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(logout);

export default router;
