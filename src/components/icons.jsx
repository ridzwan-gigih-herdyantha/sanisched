function Icon({ size = 20, className, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const CloseIcon = (p) => (
  <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>
);

export const ChatIcon = (p) => (
  <Icon {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
);

export const ClinicMark = ({ size = 28, className }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
    <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 7.5v13M7.5 14h13" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);
