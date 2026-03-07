import type { MetadataRoute } from "next";
import giftsData from "@/data/gifts.json";
import type { Gift } from "@/lib/types";

const SITE_URL = "https://luxcard.mn";

const gifts = giftsData as Gift[];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastmodified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gifts`,
      lastmodified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastmodified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastmodified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const giftPages: MetadataRoute.Sitemap = gifts.map((g) => ({
    url: `${SITE_URL}/gifts/${g.slug}`,
    lastmodified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...giftPages];
}
