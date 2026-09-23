const VARIANTS = {
  primary: "bg-clinic text-white hover:bg-clinic-deep",
  light: "bg-paper text-clinic hover:bg-white",
};

// The one solid button on the page: 4px radius, never a pill
export default function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const sizing = size === "sm" ? "px-4 py-2.5 text-[15px]" : "px-6 py-4 text-base";
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-btn font-semibold transition-colors duration-150 ${sizing} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

// Underlined text action used for secondary "Book" links
export function TextAction({ className = "", ...props }) {
  return (
    <button
      type="button"
      className={`text-left text-[15px] font-semibold text-clinic underline decoration-1 underline-offset-[6px] transition-colors duration-150 hover:text-clinic-deep ${className}`}
      {...props}
    />
  );
}
