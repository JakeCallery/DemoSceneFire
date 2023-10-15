import hslToRgb from "@/app/utils/hslToRgb";

export const NUM_BYTES = 3; //red, green, blue
export function buildPalette(
  hueStart: number,
  hueRange: number,
  paletteSize: number = 256,
  lightnessPoint: number = 2,
) {
  let palette = new Uint8ClampedArray(paletteSize * NUM_BYTES);

  const hueStep = hueRange / (palette.length / NUM_BYTES);

  for (let i = 0; i < palette.length / NUM_BYTES; i++) {
    const [red, green, blue] = hslToRgb(
      ((hueStart + i) * hueStep) % 360,
      100,
      Math.min(100, (i / palette.length) * 100 * lightnessPoint),
    );
    palette[i * NUM_BYTES] = i !== 0 ? red : 0;
    palette[i * NUM_BYTES + 1] = i !== 0 ? green : 0;
    palette[i * NUM_BYTES + 2] = i !== 0 ? blue : 0;
  }

  return palette;
}
