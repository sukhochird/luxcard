const SITE_URL = "https://luxcard.mn";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LuxCard",
  url: SITE_URL,
  description:
    "Монгол дахь орон нутгийн бэлгийн карт — ресторан, салон, кофе шоп, туршлага.",
  inLanguage: "mn",
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
