"use client";
import React, { useRef } from "react";
import PixelCanvas from "../PixelCanvas";

interface FireCanvasProps {
  width: number;
  height: number;
  palette: Uint8ClampedArray;
}

const NUM_DATA_COLOR_BYTES = 4;
const FireCanvas = ({ width, height, palette }: FireCanvasProps) => {
  const fireDataRef = useRef(new Uint8ClampedArray(width * height));
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
