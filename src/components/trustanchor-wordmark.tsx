interface TrustAnchorWordmarkProps {
  detail?: string;
  tone?: "dark" | "light";
}

export function TrustAnchorWordmark({
  detail = "Trusted certificate registry",
  tone = "dark"
}: TrustAnchorWordmarkProps): JSX.Element {
  return (
    <div className={`brand-signature brand-signature-${tone}`}>
      <div aria-hidden="true" className="brand-emblem">
        <span className="brand-emblem-ring" />
        <span className="brand-emblem-core">TA</span>
      </div>
      <div className="brand-signature-copy">
        <strong>TrustAnchor</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}
