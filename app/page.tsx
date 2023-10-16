"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { buildPalette } from "@/app/utils/rgbPaletteBuilder";
import TextHandler from "@/app/components/TextHandler";
import { OverlayDataObj } from "@/app/interfaces/interfaces";
import JackOLantern from "@/app/components/JackOLantern";
import { useRouter, useSearchParams } from "next/navigation";

const WIDTH = 320;
const HEIGHT = 240;
const UPDATE_INTERVAL_MS = 250;
export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [palette, setPalette] = useState<Uint8ClampedArray>(
    new Uint8ClampedArray(1),
  );
  const [newFireData, setNewFireData] = useState<OverlayDataObj | null>(null);
  const [fireWidth, setFireWidth] = useState(
    Math.min(Number(searchParams.get("fw")) || Math.floor(WIDTH / 2), WIDTH),
  );
  const [fireCenterOffset, setFireCenterOffset] = useState(
    Math.min(Number(searchParams.get("co")) || Math.floor(WIDTH / 2), WIDTH),
  );
  const [fireHeightPercent, setFireHeightPercent] = useState(
    Math.min(Number(searchParams.get("hp")) || 50, 100),
  );
  const [paletteStart, setPaletteStart] = useState(
    Math.min(Number(searchParams.get("ps")) || 0, 360),
  );
  const [paletteRange, setPaletteRange] = useState(
    Math.min(Number(searchParams.get("pr")) || 60, 360),
  );
  const [renderJack, setRenderJack] = useState(
    searchParams.get("rj") === "true" || false,
  );
  const [fireMessage, setFireMessage] = useState(searchParams.get("fm") || "");
  // const [wordList, setWordList] = useState(["1", "2", "3", "4", "5"]);
  // const [currentWord, setCurrentWord] = useState("test");
  const [wordList, setWordList] = useState<string[]>([]);
  const lastUpdateTimeRef = useRef(performance.now());
  const timerRef = useRef<NodeJS.Timeout>();

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
    timerRef.current = setTimeout(() => {
      if (lastUpdateTimeRef.current + UPDATE_INTERVAL_MS <= performance.now()) {
        router.replace(
          `?fw=${fireWidth}&co=${fireCenterOffset}&hp=${fireHeightPercent}&ps=${paletteStart}&pr=${paletteRange}&rj=${renderJack}&fm=${fireMessage}`,
        );
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearTimeout(timerRef.current);
  }, [
    router,
    fireWidth,
    fireCenterOffset,
    fireHeightPercent,
    paletteStart,
    paletteRange,
    renderJack,
    fireMessage,
  ]);

  useEffect(() => {
    setPalette(buildPalette(paletteStart, paletteRange, 256, 4));
  }, [paletteStart, paletteRange]);

  useEffect(() => {
    if (fireCenterOffset + Math.ceil(fireWidth / 2) >= WIDTH) {
      setFireCenterOffset(WIDTH - Math.floor(fireWidth / 2));
    }
  }, [fireCenterOffset, fireWidth]);

  function onRenderJackCBChange(e: ChangeEvent<HTMLInputElement>) {
    setRenderJack(e.target.checked);
  }

  function onNewMessage(message: string) {
    setWordList(message.split(" ", 10));
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
      <TextHandler
        onNewFireData={onNewFireData}
        wordList={wordList}
        onNewMessage={onNewMessage}
        mainCanvasWidth={WIDTH}
        mainCanvasHeight={HEIGHT}
      />
      <input
        id="firewidthslider"
        type="range"
        min="0"
        max={WIDTH}
        step="1"
        value={fireWidth}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setFireWidth(Number(e.target.value));
          lastUpdateTimeRef.current = performance.now();
        }}
      />

      <input
        id="firecenteroffsetslider"
        type="range"
        min={Math.floor(fireWidth / 2)}
        max={WIDTH - Math.floor(fireWidth / 2)}
        step="1"
        value={fireCenterOffset}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setFireCenterOffset(Number(e.target.value));
          lastUpdateTimeRef.current = performance.now();
        }}
        disabled={WIDTH === fireWidth}
      />

      <input
        type="range"
        id="fireheightslider"
        min={0}
        max={100}
        step={1}
        value={fireHeightPercent}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setFireHeightPercent(Number(e.target.value));
          lastUpdateTimeRef.current = performance.now();
        }}
      />

      <input
        type="range"
        id="firepalettestart"
        min={1}
        max={360}
        value={paletteStart}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setPaletteStart(Number(e.target.value));
          lastUpdateTimeRef.current = performance.now();
        }}
      />

      <input
        type="range"
        id="paletteRange"
        min={1}
        max={360}
        value={paletteRange}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          lastUpdateTimeRef.current = performance.now();
          setPaletteRange(Number(e.target.value));
        }}
      />
    </main>
  );
}
