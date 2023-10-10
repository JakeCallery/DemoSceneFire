"use client";
import React from "react";
import PixelCanvas from "../PixelCanvas";

const WIDTH = 320;
const HEIGHT = 240;

const FireCanvas = () => {
  function updatePixels(imageData: ImageData) {
    for (let offset = 0; offset < WIDTH * 4; offset += 4) {
      imageData.data[offset] = 255;
      imageData.data[offset + 3] = 255;
    }
    return imageData;
  }

  return (
    <>
      <PixelCanvas
        id={"firecanvas"}
        width={WIDTH}
        height={HEIGHT}
        updatePixels={updatePixels}
      />
    </>
  );
};

export default FireCanvas;
