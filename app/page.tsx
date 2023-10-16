"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { ChangeEvent, useEffect, useState } from "react";
import { buildPalette } from "@/app/utils/rgbPaletteBuilder";
import TextHandler from "@/app/components/TextHandler";
import { OverlayDataObj } from "@/app/interfaces/interfaces";
import JackOLantern from "@/app/components/JackOLantern";
import { useRouter, useSearchParams } from "next/navigation";

const WIDTH = 320;
const HEIGHT = 240;

export default function Home() {
  const [palette, setPalette] = useState<Uint8ClampedArray>(
    new Uint8ClampedArray(1),
  );

  const [newFireData, setNewFireData] = useState<OverlayDataObj | null>(null);

  const [fireHeightPercent, setFireHeightPercent] = useState(50);
  const [paletteStart, setPaletteStart] = useState(0);
  const [paletteRange, setPaletteRange] = useState(60);

  const router = useRouter();
  const searchParams = useSearchParams();

  const renderJack = searchParams.get("rj") === "true" || false;
  const fireWidth = Number(searchParams.get("fw")) || Math.floor(WIDTH / 2);
  const fireCenterOffset =
    Number(searchParams.get("co")) || Math.floor(WIDTH / 2);

  function onNewFireData(
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
  ) {
    setNewFireData({
      data,
      dataWidth: dataWidth,
      dataHeight: dataHeight,
      contentWidth: contentWidth,
      contentHeight: contentHeight,
    });
  }

  useEffect(() => {
    setPalette(buildPalette(paletteStart, paletteRange, 256, 4));
  }, [paletteStart, paletteRange]);

  useEffect(() => {
    if (fireCenterOffset + Math.ceil(fireWidth / 2) >= WIDTH) {
      // setFireCenterOffset(WIDTH - Math.floor(fireWidth / 2));
      updateSearchParam("co", (WIDTH - Math.floor(fireWidth / 2)).toString());
    }
  }, [fireCenterOffset, fireWidth]);

  function onRenderJackCBChange(e: ChangeEvent<HTMLInputElement>) {
    updateSearchParam("rj", e.target.checked.toString());
  }

  function updateSearchParam(key: string, value: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const newString = current.toString();
    router.replace(`?${newString}`);
  }

  return (
    <main>
      <h1>Demoscene Fire Effect</h1>
      <FireCanvas
        width={WIDTH}
        height={HEIGHT}
        palette={palette}
        overlayFireData={newFireData}
        fireCenterOffset={fireCenterOffset}
        fireWidth={fireWidth}
        fireHeightPercent={fireHeightPercent}
      />
      <JackOLantern
        width={WIDTH}
        height={HEIGHT}
        onNewFireData={onNewFireData}
        renderJack={renderJack}
        onRenderJackCBChange={onRenderJackCBChange}
      />
      <TextHandler onNewFireData={onNewFireData} />
      <input
        id="firewidthslider"
        type="range"
        min="0"
        max={WIDTH}
        step="1"
        defaultValue={Math.floor(WIDTH / 2)}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          updateSearchParam("fw", e.target.value.toString())
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
          updateSearchParam("co", e.target.value.toString())
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

      <input
        type="range"
        id="firepalettestart"
        min={1}
        max={360}
        defaultValue={0}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setPaletteStart(Number(e.target.value))
        }
      />

      <input
        type="range"
        id="paletteRange"
        min={1}
        max={360}
        defaultValue={60}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setPaletteRange(Number(e.target.value))
        }
      />
    </main>
  );
}
