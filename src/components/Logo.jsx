/**
 * Crown mark used in the navbar, footer and favicon.
 */
export function CrownMark({ className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 19h18v-2H3v2zm.5-4L5 7.5l4.3 3.2L12 4.5l2.7 6.2L19 7.5l1.5 7.5h-17z" />
    </svg>
  )
}

/**
 * Brand wordmark: gold crown + JCROWN over letter-spaced DIGITALS.
 */
export default function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="JCROWN DIGITALS — back to top">
      <CrownMark className="h-7 w-7 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-gold">
          JCROWN
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.42em] text-muted">
          Digitals
        </span>
      </span>
    </a>
  )
}
