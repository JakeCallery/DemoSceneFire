"use client";
import FireCanvas from "@/app/components/FireCanvas/FireCanvas";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { buildPalette } from "@/app/utils/rgbPaletteBuilder";
import TextHandler from "@/app/components/TextHandler";
import { OverlayDataObj } from "@/app/interfaces/interfaces";
import JackOLantern from "@/app/components/JackOLantern";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const WIDTH = 320;
const HEIGHT = 240;
const UPDATE_INTERVAL_MS = 250;
const MAX_WORDS = 20;
const MAX_CHARS = 140;
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
  const [wordList, setWordList] = useState<string[]>(
    searchParams.get("fm")?.split(" ", MAX_WORDS) || [],
  );

  const lastUpdateTimeRef = useRef(performance.now());
  const renderTextOnlyRef = useRef(false);
  const lastTextRenderTimeRef = useRef(performance.now());
  const timerRef = useRef<NodeJS.Timeout>();

  function onNewFireData(
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
    source: string,
  ) {
    if (source === "text") {
      if (!renderTextOnlyRef.current) {
        lastTextRenderTimeRef.current = performance.now();
      }
      renderTextOnlyRef.current = true;
    }

    if (
      (source === "text" && renderTextOnlyRef.current) ||
      (!(source === "text") && !renderTextOnlyRef.current) ||
      !renderJack
    ) {
      setNewFireData({
        data,
        dataWidth: dataWidth,
        dataHeight: dataHeight,
        contentWidth: contentWidth,
        contentHeight: contentHeight,
      });
    }

    if (
      renderTextOnlyRef.current &&
      lastTextRenderTimeRef.current + 18 <= performance.now()
    ) {
      renderTextOnlyRef.current = false;
    }
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (lastUpdateTimeRef.current + UPDATE_INTERVAL_MS <= performance.now()) {
        router.replace(
          `?fw=${fireWidth}&co=${fireCenterOffset}&hp=${fireHeightPercent}&ps=${paletteStart}&pr=${paletteRange}&rj=${renderJack}&fm=${fireMessage}`,
          { scroll: false },
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
    setWordList(message.split(" ", MAX_WORDS));
    setFireMessage(message);
  }

  return (
    <main className="p-5 max-w-5xl ml-auto mr-auto">
      <a
        href="https://www.linkedin.com/in/jakecallery/"
        className=" w-full text-right"
      >
        <div className="bg-primary p-5 rounded-btn">
          <p className="font-bold text-2xl">Jake Callery</p>
          <p className="text-lg">Frontend Developer, Open For Work</p>
          <p className="text-sm text-secondary">click for profile</p>
        </div>
      </a>

      <div className="mt-5">
        <p className="font-bold text-2xl">Experiment:</p>
        <p>My take on the old school demo scene fire effect</p>
        <a
          className="text-secondary"
          href="https://github.com/JakeCallery/DemoSceneFire"
        >
          Source Code on Github
        </a>
      </div>
      <div className="flex-row space-x-2 mt-2">
        <TwitterShareButton
          url="https://fire.jakecallery.com"
          title="Flames for Haloween"
          via="jakecallery"
          hashtags={["haloween", "demoscene", "fire"]}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
        <FacebookShareButton
          url="https://fire.jakecallery.com"
          quote="Some old school flames for haloween!"
          hashtag="#demoscene"
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
      <div className="divider before:bg-base-50 after:bg-base-50" />
      <div className="flex justify-center">
        <FireCanvas
          width={WIDTH}
          height={HEIGHT}
          palette={palette}
          overlayFireData={newFireData}
          fireCenterOffset={fireCenterOffset}
          fireWidth={fireWidth}
          fireHeightPercent={fireHeightPercent}
        />
      </div>
      <p className="mt-5">
        <span className="font-bold">Pro Tip</span>: Copy and paste link in
        address bar to send message and configuration to friends
      </p>
      <div className="divider before:bg-base-50 after:bg-base-50" />
      <div className="mt-2">
        <JackOLantern
          width={WIDTH}
          height={HEIGHT}
          onNewFireData={onNewFireData}
          renderJack={renderJack}
          onRenderJackCBChange={onRenderJackCBChange}
        />
      </div>
      <div className="mt-5">
        <TextHandler
          onNewFireData={onNewFireData}
          wordList={wordList}
          onNewMessage={onNewMessage}
          mainCanvasWidth={WIDTH}
          mainCanvasHeight={HEIGHT}
          maxChars={MAX_CHARS}
        />
      </div>
      <p className="mt-5">Fire Width</p>
      <input
        id="firewidthslider"
        className="range range-secondary"
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

      <p className="mt-2">Position</p>
      <input
        id="firecenteroffsetslider"
        className="range range-secondary col-span-8"
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

      <p className="mt-2">Rage</p>
      <input
        type="range"
        className="range range-secondary col-span-8"
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

      <p className="mt-2">Hue Base</p>
      <input
        type="range"
        className="range range-secondary col-span-8"
        id="firepalettestart"
        min={1}
        max={360}
        value={paletteStart}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setPaletteStart(Number(e.target.value));
          lastUpdateTimeRef.current = performance.now();
        }}
      />

      <p className="mt-2">Hue Range</p>
      <input
        type="range"
        className="range range-secondary col-span-8"
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
