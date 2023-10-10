"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { useEffect, useState } from "react";
import { buildPalette } from "@/app/utils/rgbPaletteBuilder";
import TextHandler from "@/app/components/TextHandler";

const WIDTH = 320;
const HEIGHT = 240;
const OVERLAY_WIDTH = 50;
const OVERLAY_HEIGHT = 50;
export default function Home() {
  const [palette, setPalette] = useState<Uint8ClampedArray>(
    new Uint8ClampedArray(1),
  );

  const [newFireData, setNewFireData] = useState(
    new Uint8ClampedArray(50 * 50),
  );

  function onNewFireData(data: Uint8ClampedArray) {
    setNewFireData(data);
  }

  useEffect(() => {
    setPalette(buildPalette(0, 60, 256, 4));
  }, []);

  return (
    <main>
      <h1>Demoscene Fire Effect</h1>
      <FireCanvas
        width={WIDTH}
        height={HEIGHT}
        palette={palette}
        overlayFireData={newFireData}
        overlayWidth={OVERLAY_WIDTH}
        overlayHeight={OVERLAY_HEIGHT}
      />
      <TextHandler
        onNewFireData={onNewFireData}
        textWidth={OVERLAY_WIDTH}
        textHeight={OVERLAY_HEIGHT}
      />
    </main>
  );
}
