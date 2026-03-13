import { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { durationTabs, packageFeatures } from "@/data/esim-catalog";
import { PlanCategory } from "@/generated/prisma/enums";

type CountryParams = {
  slug: string;
};

export async function getCountries(_req: Request, res: Response) {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });

    return res.json({
      data: countries,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function getCountryPackages(
  req: Request<CountryParams>,
  res: Response,
) {
  try {
    const { slug } = req.params;

    const country = await prisma.country.findUnique({
      where: { slug },
    });

    if (!country) {
      return res.status(404).json({ message: "Negara tidak ditemukan" });
    }

    const plans = await prisma.plan.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const limitedPlans = plans
      .filter((plan) => plan.category === PlanCategory.LIMITED)
      .map((plan) => ({
        id: plan.id,
        title: plan.title,
        priceIdr: plan.priceIdr,
        durationTab: plan.durationTab,
      }));

    const unlimitedPlans = plans
      .filter((plan) => plan.category === PlanCategory.UNLIMITED)
      .map((plan) => ({
        id: plan.id,
        title: plan.title,
        sublabel: plan.sublabel,
        priceIdr: plan.priceIdr,
        durationTab: plan.durationTab,
      }));

    return res.json({
      data: {
        country,
        durationTabs,
        limitedPlans,
        unlimitedPlans,
        packageFeatures,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}
