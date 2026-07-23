/** Custom vibed swipe action icons. */

type IconProps = {
  className?: string;
  size?: number;
};

/** Pass / reject — "ghost them" */
export function IconGhost({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3c-3.6 0-6.5 2.7-6.5 6.1v7.2c0 1.1.9 1.6 1.7 1.1l1.3-.9c.5-.3 1.2-.2 1.6.3l.9 1.1c.5.6 1.4.6 1.9 0l.9-1.1c.4-.5 1.1-.6 1.6-.3l1.3.9c.8.5 1.7 0 1.7-1.1V9.1C18.5 5.7 15.6 3 12 3Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="10" r="1.15" fill="currentColor" />
      <circle cx="14.5" cy="10" r="1.15" fill="currentColor" />
      <path
        d="M9.2 13.2c.8.9 1.7 1.3 2.8 1.3s2-.4 2.8-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Like — vibe waveform (not a heart) */
export function IconVibeWave({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3.5 12h2.2l1.4-4.2 1.8 8.4L11.2 7l1.9 10 1.7-5.5L16.5 14h4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.35" />
    </svg>
  );
}

/** Super vibe — aura burst (not a star) */
export function IconAura({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <path
        d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="6.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeOpacity="0.45"
        strokeDasharray="2.2 2.8"
      />
    </svg>
  );
}

/** Rewind — yoink / undo last pass */
export function IconYoink({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8.2 7.2H5v-3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 7.4a7.5 7.5 0 1 1-1.1 4.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M10.2 12.2h4.8c.9 0 1.5.7 1.3 1.5l-.5 2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12.4" cy="11.2" r="1" fill="currentColor" />
    </svg>
  );
}
