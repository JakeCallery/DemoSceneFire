"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { useEffect, useState } from "react";
import { buildPalette } from "@/app/utils/rgbPaletteBuilder";

const WIDTH = 320;
const HEIGHT = 240;

export default function Home() {
  const [palette, setPalette] = useState<Uint8ClampedArray>(
    new Uint8ClampedArray(1),
  );

  useEffect(() => {
    setPalette(buildPalette(0, 0));
  }, []);

  return (
    <main>
      <h1>Demoscene Fire Effect</h1>
      <FireCanvas width={WIDTH} height={HEIGHT} palette={palette} />
    </main>
  );
}
