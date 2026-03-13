import { getRegionPackages, getRegions } from "@/controller/region.controller";
import { Router } from "express";

const router = Router();

router.get("/", getRegions);
router.get("/:slug/packages", getRegionPackages);

export default router;
