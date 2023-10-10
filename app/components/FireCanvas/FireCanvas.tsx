"use client";
import React, { useEffect, useRef } from "react";
import PixelCanvas from "../PixelCanvas";

interface FireCanvasProps {
  width: number;
  height: number;
  palette: Uint8ClampedArray;
  overlayFireData: Uint8ClampedArray;
  overlayWidth: number;
  overlayHeight: number;
}

const NUM_DATA_COLOR_BYTES = 4;
const FireCanvas = ({
  width,
  height,
  palette,
  overlayFireData,
  overlayWidth,
  overlayHeight,
}: FireCanvasProps) => {
  const fireDataRef = useRef(new Uint8ClampedArray(width * height));

  useEffect(() => {
    if (!overlayFireData) return;
    const xOffset = Math.floor(width / 2 - overlayWidth / 2);
    const yOffset = Math.floor(height - height / 10 - overlayHeight / 2);
    for (let y = 0; y < overlayHeight; y++) {
      for (let x = 0; x < overlayWidth; x++) {
        if (overlayFireData[y * overlayWidth + x] !== 0) {
          fireDataRef.current[(y + yOffset) * width + (x + xOffset)] =
            overlayFireData[y * overlayWidth + x];
        }
      }
    }
  }, [overlayFireData, height, width, overlayWidth, overlayHeight]);

  function randomizeFirstRow() {
    const bottomRowOffset = (height - 1) * width;
    for (let xOffset = 0; xOffset < width; xOffset++) {
      fireDataRef.current[bottomRowOffset + xOffset] = Math.floor(
        Math.random() * 255,
      );
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
          fireDataRef.current[
            ((y + 1) % height) * width + ((x - 1 + width) % width)
          ];

        //Down 1 Center
        const val2 = fireDataRef.current[((y + 1) % height) * width + x];

        //Down 1 Right 1
        const val3 =
          fireDataRef.current[((y + 1) % height) * width + ((x + 1) % width)];

        //Down 2 Center
        const val4 = fireDataRef.current[(((y + 2) * width) % height) + x];

        const summedValue = val1 + val2 + val3 + val4;

        fireDataRef.current[y * width + x] = Math.floor(
          (summedValue * 600) / 1801,
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
