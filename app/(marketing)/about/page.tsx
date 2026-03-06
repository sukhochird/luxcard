import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import merchantsData from "@/data/merchants.json";

export const metadata = {
  title: "Бидний тухай — LuxCard",
  description:
    "LuxCard нь Монгол дахь ресторан, салон, туршлагыг холбоно. Бэлгийг утга учиртай, шууд болгоно.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Орон нутгийн эхний сонголт",
    description:
      "Монгол дахь шилдэг орон нутгийн бизнесүүдтэй хамтраж, бэлэг бүр нийгмийг дэмжинэ.",
  },
  {
    icon: Shield,
    title: "Аюулгүй, энгийн",
    description:
      "Аюулгүй төлж, бэлгийн картыг секундэд илгээнэ. Хүлээн авагчид төвөггүй.",
  },
  {
    icon: Sparkles,
    title: "Жинхэнэ туршлага",
    description:
      "Ресторан, спа, кофе шопоос эхлээд—таньд үнэ цэнэтэй мөчүүдийг өгөхөд туслана.",
  },
];

const STATS = [
  { value: "50+", label: "Худалдаа эрхлэгчид" },
  { value: "Улаанбаатар & бусад", label: "Үйл ажиллагааны бүс" },
  { value: "Шууд", label: "Хүргэлт" },
];

const TEAM = [
  { name: "Багийн гишүүн", role: "Хамт үүсгэн байгуулагч & Гүйцэтгэх захирал", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Багийн гишүүн", role: "Хамтын ажиллагааны тэргүүн", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Багийн гишүүн", role: "Бүтээгдэхүүн & Дизайн", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];

type MerchantEntry = {
  brandName: string;
  brandLogo: string;
  shortIntro: string;
};

const merchantsList = Object.entries(merchantsData as Record<string, MerchantEntry>).map(
  ([slug, m]) => ({ slug, ...m })
);

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
          aria-labelledby="about-heading"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="about-heading"
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              <span className="text-primary">LuxCard</span>-ийн тухай
            </h1>
            <p className="mt-6 text-lg text-foreground/80">
              Хамгийн сайн бэлэг нь орон нутгийн гэдэгт бид итгэнэ. LuxCard-аар
              Монгол дахь ресторан, салон, кофе шоп, туршлагад бэлгийн картыг шууд
              илгээнэ.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section
          className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="mission-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="mission-heading"
                className="text-2xl font-bold text-foreground sm:text-3xl"
              >
                Бидний зорилго
              </h2>
              <p className="mt-4 text-foreground/80">
                Бэлгийг хялбар, утга учиртай, орон нутгийн болгох.
                Төрсөн өдөр, талархал эсвэл зүгээр л—Монголыг онцгой болгож буй газрууд,
                хүмүүстэй таныг холбоно.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          className="border-t border-foreground/10 px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="values-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id="values-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              Бидний үнэт зүйлс
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground/80">
              Үнэт зүйлс маань худалдаа эрхлэгчидтэй хамтрах, танд үйлчлэхэд удирдлага болно.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 text-foreground/70">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-16 sm:px-6 lg:px-8"
          aria-label="Үзүүлэлт"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">
                    {value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground/70">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Where we are */}
        <section
          className="border-t border-foreground/10 px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="location-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2
                  id="location-heading"
                  className="text-3xl font-bold text-foreground sm:text-4xl"
                >
                  Монголд зориулсан
                </h2>
                <p className="mt-4 text-lg text-foreground/80">
                  Улаанбаатарт төвлөрч, бусад хот руу тэлж байна. Манай
                  худалдаа эрхлэгчид — ресторан, салон, кафе, туршлагын үйлчилгээг итгэж
                  болно.
                </p>
                <div className="mt-8 flex items-center gap-3 text-foreground/80">
                  <MapPin className="size-5 shrink-0 text-primary" />
                  <span>Улаанбаатар, Монгол</span>
                </div>
              </div>
              <div className="flex flex-col gap-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Бэлэг өгөгчдэд
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Карт сонгоод мессеж нэмж төлнө—болсон. Хүлээн авагч шууд авна.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Худалдаа эрхлэгчдэд
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Шинэ харилцагчид хүрч, бизнесээ өргөжүүлэхийн тулд бидэнтэй хамтрана уу.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section
          className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="team-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id="team-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              Манай баг
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground/80">
              LuxCard-ын ард — орон нутгийн бэлэг, сайхан туршлагад анхаардаг хүмүүс.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member) => (
                <div
                  key={member.role}
                  className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-lg transition-all duration-200 hover:border-foreground/20 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
                    <Image
                      src={member.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted merchants */}
        <section
          id="merchants"
          className="border-t border-foreground/10 px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="merchants-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id="merchants-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              Найдвартай худалдаа эрхлэгчид
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-foreground/80">
              Монгол дахь шилдэг орон нутгийн бизнесүүдтэй хамтрадаг. Эдгээр брэндийн
              бэлгийн картыг шууд илгээнэ.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {merchantsList.map(({ slug, brandName, brandLogo, shortIntro }) => (
                <Link
                  key={slug}
                  href={`/gifts/${slug}`}
                  className="group flex gap-6 rounded-2xl border border-foreground/10 bg-background p-6 shadow-lg transition-all duration-200 hover:border-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:size-24">
                    <Image
                      src={brandLogo}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                      {brandName}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
                      {shortIntro}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Бэлгийн карт үзэх
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="cta-heading"
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              Баярыг илгээхэд бэлэн үү?
            </h2>
            <p className="mt-4 text-foreground/80">
              Бэлгийн картуудыг үзэж, секундэд утга учиртай зүйл илгээнэ үү.
            </p>
            <Link
              href="/gifts"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Бэлгийн картуудыг үзэх
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
