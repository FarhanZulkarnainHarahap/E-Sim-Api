import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PlanCategory } from "../src/generated/prisma/enums";
import { countries } from "../src/data/country";

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL belum di-set di environment");
}

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
});

const prisma = new PrismaClient({ adapter });

const plans = [
  {
    id: "plan-limited-1",
    title: "1 Hari | 1 GB",
    sublabel: null,
    priceIdr: 78000,
    durationTab: "1h",
    category: PlanCategory.LIMITED,
    sortOrder: 1,
  },
  {
    id: "plan-limited-2",
    title: "3 Hari | 3 GB",
    sublabel: null,
    priceIdr: 141000,
    durationTab: "3h",
    category: PlanCategory.LIMITED,
    sortOrder: 2,
  },
  {
    id: "plan-limited-3",
    title: "7 Hari | 5 GB",
    sublabel: null,
    priceIdr: 227000,
    durationTab: "7h",
    category: PlanCategory.LIMITED,
    sortOrder: 3,
  },
  {
    id: "plan-limited-4",
    title: "10 Hari | 5 GB",
    sublabel: null,
    priceIdr: 273000,
    durationTab: "10h",
    category: PlanCategory.LIMITED,
    sortOrder: 4,
  },
  {
    id: "plan-limited-5",
    title: "15 Hari | 10 GB",
    sublabel: null,
    priceIdr: 531000,
    durationTab: "15h",
    category: PlanCategory.LIMITED,
    sortOrder: 5,
  },
  {
    id: "plan-unlimited-1",
    title: "7 Hari | Unlimited",
    sublabel: "FUP 0.50GB/hari",
    priceIdr: 242000,
    durationTab: "7h",
    category: PlanCategory.UNLIMITED,
    sortOrder: 101,
  },
  {
    id: "plan-unlimited-2",
    title: "7 Hari | Unlimited",
    sublabel: "FUP 1GB/hari",
    priceIdr: 383000,
    durationTab: "7h",
    category: PlanCategory.UNLIMITED,
    sortOrder: 102,
  },
  {
    id: "plan-unlimited-3",
    title: "7 Hari | Unlimited",
    sublabel: "FUP 2GB/hari",
    priceIdr: 648000,
    durationTab: "7h",
    category: PlanCategory.UNLIMITED,
    sortOrder: 103,
  },
];

const regions = [
  {
    id: "region-amerika-latin",
    name: "Amerika Latin",
    slug: "amerika-latin",
    icon: "🌎",
    countries: [
      "argentina",
      "bolivia",
      "brasil",
      "chili",
      "kolombia",
      "ekuador",
      "paraguay",
      "peru",
      "uruguay",
      "venezuela",
      "panama",
      "kosta-rika",
    ],
  },
  {
    id: "region-amerika-utara",
    name: "Amerika Utara",
    slug: "amerika-utara",
    icon: "🌍",
    countries: ["amerika-serikat", "kanada", "meksiko"],
  },
  {
    id: "region-asia",
    name: "Asia",
    slug: "asia",
    icon: "🌱",
    countries: [
      "china",
      "hong-kong",
      "jepang",
      "korea-selatan",
      "taiwan",
      "india",
      "indonesia",
      "malaysia",
      "singapura",
      "thailand",
      "vietnam",
      "filipina",
      "pakistan",
      "bangladesh",
      "nepal",
      "sri-lanka",
    ],
  },
  {
    id: "region-asia-tenggara",
    name: "Asia Tenggara",
    slug: "asia-tenggara",
    icon: "🪻",
    countries: [
      "indonesia",
      "malaysia",
      "singapura",
      "thailand",
      "vietnam",
      "filipina",
      "kamboja",
      "laos",
    ],
  },
  {
    id: "region-asia-timur-3",
    name: "Asia Timur (3 Negara)",
    slug: "asia-timur-3-negara",
    icon: "🟧",
    countries: ["china", "jepang", "korea-selatan"],
  },
  {
    id: "region-cn-hk-mo-tw",
    name: "Cina (CN, HK, MO) & TW",
    slug: "cina-cn-hk-mo-tw",
    icon: "🟨",
    countries: ["china", "hong-kong", "makau", "taiwan"],
  },
  {
    id: "region-eropa",
    name: "Eropa",
    slug: "eropa",
    icon: "🛫",
    countries: [
      "albania",
      "andorra",
      "austria",
      "belanda",
      "belgia",
      "bosnia-dan-herzegovina",
      "bulgaria",
      "kroasia",
      "republik-ceko",
      "denmark",
      "estonia",
      "finlandia",
      "perancis",
      "jerman",
      "yunani",
      "hongaria",
      "islandia",
      "irlandia",
      "italia",
      "latvia",
      "lituania",
      "luksemburg",
      "malta",
      "monako",
      "montenegro",
      "norwegia",
      "polandia",
      "portugal",
      "rumania",
      "serbia",
      "slovakia",
      "slovenia",
      "spanyol",
      "swedia",
      "swiss",
      "ukraina",
    ],
  },
  {
    id: "region-oseania",
    name: "Oseania",
    slug: "oseania",
    icon: "🌊",
    countries: ["australia", "selandia-baru"],
  },
  {
    id: "region-sea-3",
    name: "SEA (MY, SG, TH)",
    slug: "sea-my-sg-th",
    icon: "🩵",
    countries: ["malaysia", "singapura", "thailand"],
  },
  {
    id: "region-mena",
    name: "Timur Tengah & Afrika Utara",
    slug: "timur-tengah-afrika-utara",
    icon: "🩵",
    countries: [
      "arab-saudi",
      "emirat-arab-bersatu",
      "qatar",
      "kuwait",
      "bahrain",
      "oman",
      "yordania",
      "israel",
      "lebanon",
      "mesir",
      "maroko",
      "tunisia",
    ],
  },
  {
    id: "region-middle-east-6",
    name: "Timur Tengah (6 Negara)",
    slug: "timur-tengah-6-negara",
    icon: "🟩",
    countries: [
      "arab-saudi",
      "emirat-arab-bersatu",
      "qatar",
      "kuwait",
      "bahrain",
      "oman",
    ],
  },
];

async function main() {
  console.log("Start seeding...");

  await prisma.regionCountry.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.region.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.country.deleteMany();

  await prisma.country.createMany({
    data: countries.map((country) => ({
      name: country.name,
      slug: country.slug,
      flagUrl: country.flagUrl,
    })),
    skipDuplicates: true,
  });

  await prisma.plan.createMany({
    data: plans,
    skipDuplicates: true,
  });

  await prisma.region.createMany({
    data: regions.map(({ countries: _countries, ...region }) => region),
    skipDuplicates: true,
  });

  const countryRows = await prisma.country.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const countryMap = new Map(countryRows.map((item) => [item.slug, item.id]));

  const regionCountryRows = regions.flatMap((region) =>
    region.countries.flatMap((countrySlug) => {
      const countryId = countryMap.get(countrySlug);

      if (!countryId) {
        console.warn(
          `Country dengan slug "${countrySlug}" tidak ditemukan untuk region "${region.slug}"`,
        );
        return [];
      }

      return [
        {
          regionId: region.id,
          countryId,
        },
      ];
    }),
  );

  await prisma.regionCountry.createMany({
    data: regionCountryRows,
    skipDuplicates: true,
  });

  console.log(`Seed countries: ${countries.length}`);
  console.log(`Seed plans: ${plans.length}`);
  console.log(`Seed regions: ${regions.length}`);
  console.log(`Seed region countries: ${regionCountryRows.length}`);
  console.log("Seeding finished");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
