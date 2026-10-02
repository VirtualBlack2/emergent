export const Logo = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#121A17" stroke="rgba(255,255,255,0.08)" />
    <path d="M7 25 L15 7 L23 25" fill="none" stroke="#F1F5F2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6 18.5 H19.2" stroke="#F1F5F2" strokeWidth="3" strokeLinecap="round" />
    <path d="M24.5 6.5c2 2.6 3 4.3 3 5.6a3 3 0 0 1-6 0c0-1.3 1-3 3-5.6z" fill="#34E39A" />
  </svg>
);
