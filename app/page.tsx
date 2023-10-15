"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { ChangeEvent, useEffect, useState } from "react";
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

  const [fireWidth, setFireWidth] = useState(Math.floor(WIDTH / 2));
  const [fireCenterOffset, setFireCenterOffset] = useState(
    Math.floor(WIDTH / 2),
  );

  const [fireHeightPercent, setFireHeightPercent] = useState(50);

  function onNewFireData(data: Uint8ClampedArray) {
    setNewFireData(data);
  }

  useEffect(() => {
    setPalette(buildPalette(0, 60, 256, 4));
  }, []);

  useEffect(() => {
    if (fireCenterOffset + Math.ceil(fireWidth / 2) >= WIDTH) {
      setFireCenterOffset(WIDTH - Math.floor(fireWidth / 2));
    }
  }, [fireCenterOffset, fireWidth]);

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
        fireCenterOffset={fireCenterOffset}
        fireWidth={fireWidth}
        fireHeightPercent={fireHeightPercent}
      />
      <TextHandler
        onNewFireData={onNewFireData}
        textWidth={OVERLAY_WIDTH}
        textHeight={OVERLAY_HEIGHT}
      />
      <input
        id="firewidthslider"
        type="range"
        min="0"
        max={WIDTH}
        step="1"
        defaultValue={Math.floor(WIDTH / 2)}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setFireWidth(Number(e.target.value))
        }
      />

      <input
        id="firecenteroffsetslider"
        type="range"
        min={Math.floor(fireWidth / 2)}
        max={WIDTH - Math.floor(fireWidth / 2)}
        step="1"
        value={fireCenterOffset}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setFireCenterOffset(Number(e.target.value))
        }
        disabled={WIDTH === fireWidth}
      />

      <input
        type="range"
        id="fireheightslider"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setFireHeightPercent(Number(e.target.value))
        }
      />
    </main>
  );
}
