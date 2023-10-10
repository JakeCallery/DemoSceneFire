import hslToRgb from "@/app/utils/hslToRgb";

export const NUM_COLORS = 3; //red, green, blue
export function buildPalette(
  hueStart: number,
  hueRange: number,
  paletteSize: number = 256,
) {
  let palette = new Uint8ClampedArray(paletteSize * NUM_COLORS);

  const hueStep = hueRange / (palette.length / NUM_COLORS);

  for (let i = 0; i < palette.length; i += NUM_COLORS) {
    const [red, green, blue] = hslToRgb(
      (hueStart + (i / NUM_COLORS) * hueStep) % 360,
      100,
      (i / NUM_COLORS / paletteSize) * 100,
    );
    palette[i] = red;
    palette[i + 1] = green;
    palette[i + 2] = blue;
  }

  return palette;
}
