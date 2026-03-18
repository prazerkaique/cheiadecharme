import { STORE_NAME, STORE_ADDRESS } from "@/lib/mock-data";

export function TVFooter() {
  return (
    <footer
      className="flex items-center justify-between px-8 text-brand-text-muted"
      style={{ height: "var(--tv-footer-h)", fontSize: "var(--text-small)" }}
    >
      <span className="font-display font-semibold">{STORE_NAME}</span>
      <span>{STORE_ADDRESS}</span>
    </footer>
  );
}
