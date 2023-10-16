"use client";
import React, { useEffect, useRef } from "react";
import PixelCanvas from "../PixelCanvas";
import { OverlayDataObj } from "@/app/interfaces/interfaces";

const FIRE_COOL_MIN = 4.001;
const FIRE_COOL_MAX = 5.0;
const FIRE_COOL_RANGE = FIRE_COOL_MAX - FIRE_COOL_MIN;

interface FireCanvasProps {
  width: number;
  height: number;
  palette: Uint8ClampedArray;
  overlayFireData: OverlayDataObj | null;
  fireCenterOffset: number;
  fireWidth: number;
  fireHeightPercent: number;
}

const NUM_DATA_COLOR_BYTES = 4;
const FireCanvas = ({
  width,
  height,
  palette,
  overlayFireData,
  fireCenterOffset,
  fireWidth,
  fireHeightPercent,
}: FireCanvasProps) => {
  const fireDataRef = useRef(new Uint8ClampedArray(width * height));

  useEffect(() => {
    if (!overlayFireData || !overlayFireData.data) return;
    const overlayWidth = overlayFireData.dataWidth;
    const overlayHeight = overlayFireData.dataHeight;
    const xOffset = Math.floor(width / 2 - overlayFireData.contentWidth / 2);
    const yOffset = Math.floor(height / 2 - overlayFireData.contentHeight / 2);

    for (let y = 0; y < overlayHeight; y++) {
      for (let x = 0; x < overlayWidth; x++) {
        if (overlayFireData.data[y * overlayWidth + x] !== 0) {
          fireDataRef.current[(y + yOffset) * width + (x + xOffset)] =
            overlayFireData.data[y * overlayWidth + x];
        }
      }
    }
  }, [overlayFireData, height, width]);

  function randomizeFirstRow() {
    const bottomRowOffset = (height - 1) * width;
    for (let xOffset = 0; xOffset < width; xOffset++) {
      const halfFireWidth = Math.floor(fireWidth / 2);
      if (
        xOffset >= fireCenterOffset - halfFireWidth &&
        xOffset < fireCenterOffset + halfFireWidth
      ) {
        fireDataRef.current[bottomRowOffset + xOffset] = Math.floor(
          Math.random() * 255,
        );
      } else {
        fireDataRef.current[bottomRowOffset + xOffset] = 0;
      }
    }
  }

  function updatePixels(imageData: ImageData) {
    //generate first row of random values (will be used as palette indices)
    randomizeFirstRow();

    //update fire data values using near by values
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width; x++) {
        //Down 1 Left 1
        const val1 =
          y + 1 >= height || x - 1 < 0
            ? 0
            : fireDataRef.current[(y + 1) * width + x - 1];

        //Down 1 Center
        const val2 =
          y + 1 >= height ? 0 : fireDataRef.current[(y + 1) * width + x];

        //Down 1 Right 1
        const val3 =
          x + 1 >= width || y + 1 >= height
            ? 0
            : fireDataRef.current[(y + 1) * width + x + 1];

        //Down 2 Center
        const val4 =
          y + 2 >= height ? 0 : fireDataRef.current[(y + 2) * width + x];

        const summedValue = val1 + val2 + val3 + val4;
        fireDataRef.current[y * width + x] = Math.floor(
          summedValue /
            (FIRE_COOL_MAX - FIRE_COOL_RANGE * (fireHeightPercent / 100)),
        );
      }
    }

    // map fire data (palette index) to drawable position
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dataYLoc = y * width * NUM_DATA_COLOR_BYTES;
        const dataXLoc = x * NUM_DATA_COLOR_BYTES;
        const paletteBaseIndex = fireDataRef.current[y * width + x] * 3;
        imageData.data[dataYLoc + dataXLoc] = palette[paletteBaseIndex];
        imageData.data[dataYLoc + dataXLoc + 1] = palette[paletteBaseIndex + 1];
        imageData.data[dataYLoc + dataXLoc + 2] = palette[paletteBaseIndex + 2];
        imageData.data[dataYLoc + dataXLoc + 3] = 255;
      }
    }
    return imageData;
  }

  return (
    <div className="flex-row">
      <PixelCanvas
        id={"firecanvas"}
        width={width}
        height={height}
        updatePixels={updatePixels}
      />
    </div>
  );
};

export default FireCanvas;
