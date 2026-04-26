import { buildQrMatrix } from "@/modules/verification/verification-qr";

interface VerificationQrCodeProps {
  verificationCode: string;
  verificationUrl: string;
}

export function VerificationQrCode({
  verificationCode,
  verificationUrl
}: VerificationQrCodeProps): JSX.Element {
  const quietZone = 4;
  const qrMatrix = buildQrMatrix(verificationUrl);
  const viewBoxSize = qrMatrix.moduleCount + quietZone * 2;

  return (
    <div className="qr-evidence" aria-label={`QR verification code for ${verificationCode}`}>
      <svg
        aria-hidden="true"
        className="qr-evidence-code"
        focusable="false"
        role="img"
        shapeRendering="crispEdges"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <rect fill="currentColor" height={viewBoxSize} width={viewBoxSize} x="0" y="0" />
        {qrMatrix.darkModules.map(({ column, row }) => (
          <rect
            fill="var(--graphite-980)"
            height="1"
            key={`${row}-${column}`}
            width="1"
            x={column + quietZone}
            y={row + quietZone}
          />
        ))}
      </svg>
      <div className="qr-evidence-caption">
        <span className="ledger-label">Scan target</span>
        <code>{verificationUrl}</code>
      </div>
    </div>
  );
}
