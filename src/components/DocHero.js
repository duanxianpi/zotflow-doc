import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";

/**
 * Wordmark + tagline + calls to action at the top of the docs home page.
 * The page's front matter sets `hide_title`, so the <h1> lives here
 * (visually replaced by the logo).
 */
export default function DocHero({ title, tagline, actions = [] }) {
  return (
    <header className="zf-hero">
      <h1 className="zf-hero__title">
        <span className="zf-sr-only">{title}</span>
        <ThemedImage
          className="zf-hero__logo"
          alt=""
          width={354}
          height={82}
          sources={{
            light: useBaseUrl("/img/zotflow-light.svg"),
            dark: useBaseUrl("/img/zotflow-dark.svg"),
          }}
        />
      </h1>
      <p className="zf-hero__tagline">{tagline}</p>
      {actions.length > 0 && (
        <div className="zf-hero__actions">
          {actions.map(({ label, to, primary }) => (
            <Link
              key={to}
              to={to}
              className={`button button--lg ${
                primary ? "button--primary" : "button--secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
