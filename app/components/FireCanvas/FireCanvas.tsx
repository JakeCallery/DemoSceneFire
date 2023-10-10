"use client";
import React from "react";
import PixelCanvas from "../PixelCanvas";
import hslToRgb from "@/app/utils/hslToRgb";

interface FireCanvasProps {
  width: number;
  height: number;
}

const NUM_COLORS = 3;

const FireCanvas = ({ width, height }: FireCanvasProps) => {
  let palette = new Uint8ClampedArray(256 * NUM_COLORS);

  for (let i = 0; i < palette.length; i += NUM_COLORS) {
    const hueStart = 0;
    const step = 60 / (palette.length / NUM_COLORS);
    const [red, green, blue] = hslToRgb(
      hueStart + (i / NUM_COLORS) * step,
      100,
      Math.min(100, (i / NUM_COLORS / 256) * 100),
    );
    palette[i] = red;
    palette[i + 1] = green;
    palette[i + 2] = blue;
  }

  function updatePalettePixels(imageData: ImageData) {
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const yVal = y * 256 * 4;
        const xVal = x * 4;
        imageData.data[yVal + xVal] = palette[y * NUM_COLORS];
        imageData.data[yVal + xVal + 1] = palette[y * NUM_COLORS + 1];
        imageData.data[yVal + xVal + 2] = palette[y * NUM_COLORS + 2];
        imageData.data[yVal + xVal + 3] = 255;
      }
    }
    return imageData;
  }

  function updatePixels(imageData: ImageData) {
    for (let offset = 0; offset < width * 4; offset += 4) {
      imageData.data[offset] = 255;
      imageData.data[offset + 3] = 255;
    }
    return imageData;
  }

  return (
    <div className="flex-row">
      <PixelCanvas
        id={"palettecanvas"}
        width={256}
        height={256}
        updatePixels={updatePalettePixels}
      />
      {/*<PixelCanvas*/}
      {/*  id={"firecanvas"}*/}
      {/*  width={width}*/}
      {/*  height={height}*/}
      {/*  updatePixels={updatePixels}*/}
      {/*/>*/}
    </div>
  );
};

export default FireCanvas;
