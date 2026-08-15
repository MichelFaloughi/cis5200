export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect
        width="48"
        height="48"
        rx="10"
        className="fill-white stroke-neutral-300 dark:stroke-neutral-600"
        strokeWidth="1.5"
      />
      <g stroke="#011F5B" strokeWidth="1.4" opacity="0.35">
        <line x1="10" y1="17.5" x2="24" y2="11" />
        <line x1="10" y1="17.5" x2="24" y2="24" />
        <line x1="10" y1="17.5" x2="24" y2="37" />
        <line x1="10" y1="30.5" x2="24" y2="11" />
        <line x1="10" y1="30.5" x2="24" y2="24" />
        <line x1="10" y1="30.5" x2="24" y2="37" />
        <line x1="24" y1="11" x2="38" y2="17.5" />
        <line x1="24" y1="11" x2="38" y2="30.5" />
        <line x1="24" y1="24" x2="38" y2="17.5" />
        <line x1="24" y1="24" x2="38" y2="30.5" />
        <line x1="24" y1="37" x2="38" y2="17.5" />
        <line x1="24" y1="37" x2="38" y2="30.5" />
      </g>
      <g fill="#011F5B">
        <circle cx="10" cy="17.5" r="3" />
        <circle cx="10" cy="30.5" r="3" />
        <circle cx="24" cy="11" r="3" />
        <circle cx="24" cy="24" r="3" />
        <circle cx="24" cy="37" r="3" />
      </g>
      <g fill="#990000">
        <circle cx="38" cy="17.5" r="4" />
        <circle cx="38" cy="30.5" r="4" />
      </g>
    </svg>
  );
}
