"use client";
import React from "react";
import PixelCanvas from "../PixelCanvas";

interface FireCanvasProps {
  width: number;
  height: number;
  palette: Uint8ClampedArray;
}

const NUM_PALETTE_COLOR_BYTES = 3;
const NUM_DATA_COLOR_BYTES = 4;

const FireCanvas = ({ width, height, palette }: FireCanvasProps) => {
  function updatePixels(imageData: ImageData) {
    const paletteColors = palette.length / NUM_PALETTE_COLOR_BYTES;
    //Just draw the palette for now
    for (let y = 0; y < palette.length / NUM_PALETTE_COLOR_BYTES; y++) {
      for (let x = 0; x < width; x++) {
        const yVal = y * paletteColors * NUM_DATA_COLOR_BYTES;
        const xVal = x * NUM_DATA_COLOR_BYTES;
        imageData.data[yVal + xVal] = palette[y * NUM_PALETTE_COLOR_BYTES];
        imageData.data[yVal + xVal + 1] =
          palette[y * NUM_PALETTE_COLOR_BYTES + 1];
        imageData.data[yVal + xVal + 2] =
          palette[y * NUM_PALETTE_COLOR_BYTES + 2];
        imageData.data[yVal + xVal + 3] = 255;
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
