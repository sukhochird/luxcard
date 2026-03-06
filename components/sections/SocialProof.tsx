export function SocialProof() {
  const logos = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="social-proof-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p
          id="social-proof-heading"
          className="text-center text-sm font-medium uppercase tracking-wider text-foreground/60"
        >
          Trusted by 500+ local businesses
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-lg bg-foreground/10 grayscale transition-all duration-200 hover:grayscale-0"
              aria-hidden
            />
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-3xl border-t border-foreground/10 pt-12" />
      </div>
    </section>
  );
}
