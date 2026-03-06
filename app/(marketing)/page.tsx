import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { OccasionsSection } from "@/components/sections/OccasionsSection";
import { FeaturedExperiences } from "@/components/sections/FeaturedExperiences";
import { FeaturedGiftCardsSection } from "@/components/sections/FeaturedGiftCardsSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { MerchantSection } from "@/components/sections/MerchantSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TrustedLogosSection } from "@/components/sections/TrustedLogosSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { getBlurDataURL } from "@/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur-constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85";

export default async function MarketingPage() {
  const heroBlur = await getBlurDataURL(HERO_IMAGE).catch(() => FALLBACK_BLUR);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection heroBlurDataURL={heroBlur} />
        <OccasionsSection />
        <FeaturedExperiences />
        <FeaturedGiftCardsSection />
        <HowItWorks />
        <MerchantSection />
        <TestimonialsSection />
        <TrustedLogosSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
