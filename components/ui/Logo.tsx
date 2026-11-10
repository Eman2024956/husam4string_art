import { site } from "@/content/site";

/**
 * The official LOOMA wordmark, masked from the supplied artwork so it can take the
 * room's colour without being redrawn. Until the logo files are added to
 * /public/images/looma/logo/ (see content/site.ts), the name is set in the display
 * face as a clearly temporary stand-in.
 */
export function Logo({ width = 132, className = "" }: { width?: number; className?: string }) {
  if (site.logo.available) {
    return (
      <span
        role="img"
        aria-label={site.name}
        className={`block bg-current ${className}`}
        style={{
          width,
          aspectRatio: site.logo.wordmarkRatio,
          WebkitMask: `url(${site.logo.wordmark}) center / contain no-repeat`,
          mask: `url(${site.logo.wordmark}) center / contain no-repeat`,
        }}
      />
    );
  }
  return (
    <span
      className={`latin block leading-none ${className}`}
      data-logo-placeholder
      dir="ltr"
      style={{ fontSize: width * 0.235, letterSpacing: "0.34em", fontWeight: 400, marginInlineEnd: "-0.34em" }}
    >
      {site.name}
    </span>
  );
}
