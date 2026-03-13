import {
  getCountries,
  getCountryPackages,
} from "@/controller/country-controller";
import { Router } from "express";

const router = Router();

router.get("/", getCountries);
router.get("/:slug/packages", getCountryPackages);

export default router;
