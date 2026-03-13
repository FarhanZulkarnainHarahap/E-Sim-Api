import type { Request, Response } from "express";
import { prisma } from "@/configs/prisma";
import { PlanCategory } from "@/generated/prisma/enums";
import { durationTabs, packageFeatures } from "@/data/esim-catalog";

type RegionParams = {
  slug: string;
};

export async function getRegions(_req: Request, res: Response) {
  try {
    const regions = await prisma.region.findMany({
      include: {
        _count: {
          select: {
            regionCountries: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({
      data: regions.map((region) => ({
        id: region.id,
        name: region.name,
        slug: region.slug,
        icon: region.icon,
        countriesCount: region._count.regionCountries,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

export async function getRegionPackages(
  req: Request<RegionParams>,
  res: Response,
) {
  try {
    const { slug } = req.params;

    const region = await prisma.region.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            regionCountries: true,
          },
        },
        regionCountries: {
          include: {
            country: {
              select: {
                id: true,
                name: true,
                slug: true,
                flagUrl: true,
              },
            },
          },
        },
      },
    });

    if (!region) {
      return res.status(404).json({ message: "Region tidak ditemukan" });
    }

    const plans = await prisma.plan.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });

    const limitedPlans = plans
      .filter((plan) => plan.category === PlanCategory.LIMITED)
      .map((plan) => ({
        id: plan.id,
        title: plan.title,
        sublabel: plan.sublabel,
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
        region: {
          id: region.id,
          name: region.name,
          slug: region.slug,
          icon: region.icon,
          countriesCount: region._count.regionCountries,
          countries: region.regionCountries.map((item) => item.country),
        },
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
