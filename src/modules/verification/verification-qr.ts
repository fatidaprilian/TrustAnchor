import qrcode from "qrcode-generator";

export interface QrMatrix {
  moduleCount: number;
  darkModules: Array<{ column: number; row: number }>;
}

export function buildQrMatrix(inputValue: string): QrMatrix {
  const qrCode = qrcode(0, "M");
  qrCode.addData(inputValue);
  qrCode.make();

  const moduleCount = qrCode.getModuleCount();
  const darkModules: QrMatrix["darkModules"] = [];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let column = 0; column < moduleCount; column += 1) {
      if (qrCode.isDark(row, column)) {
        darkModules.push({ column, row });
      }
    }
  }

  return { darkModules, moduleCount };
}

export function buildQrSvg(inputValue: string): string {
  const quietZone = 4;
  const qrMatrix = buildQrMatrix(inputValue);
  const viewBoxSize = qrMatrix.moduleCount + quietZone * 2;
  const darkModuleRects = qrMatrix.darkModules
    .map(
      ({ column, row }) =>
        `<rect width="1" height="1" x="${column + quietZone}" y="${row + quietZone}" />`
    )
    .join("");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" shape-rendering="crispEdges">`,
    `<rect fill="#fffdf5" width="${viewBoxSize}" height="${viewBoxSize}" />`,
    `<g fill="#20232f">${darkModuleRects}</g>`,
    `</svg>`
  ].join("");
}
