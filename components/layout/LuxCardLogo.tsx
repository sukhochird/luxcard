/**
 * LuxCard лого — бэлгийн карт санал болгох icon. currentColor тул header-тэй таарна.
 */
export function LuxCardLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Карт */}
      <rect
        x="4"
        y="9"
        width="32"
        height="22"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Бэлэг зангилаа */}
      <path
        d="M20 13v3m-2.5-1.5l2.5 2 2.5-2M20 20a2 2 0 110-4 2 2 0 010 4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="14" r="1.8" fill="currentColor" />
    </svg>
  );
}
