import React, { useEffect, useRef, useState } from "react";

interface CanvasProps {
  id: string;
  width: number;
  height: number;
  updatePixels: (imageData: ImageData) => ImageData;
  scaleFactor: number;
}

const PixelCanvas = ({
  id,
  width,
  height,
  updatePixels,
  scaleFactor,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeStampRef = useRef(0);
  const [scaledWidth, setScaledWidth] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(1);

  console.log("Render");

  useEffect(() => {
    console.log("Update viewport");
    const vw = Math.max(
      window.document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
    );
    const scaleRatio = vw / width;
    setScaledWidth(Math.floor(width * scaleRatio) * scaleFactor);
    setScaledHeight(Math.floor(height * scaleRatio) * scaleFactor);
  }, [width, height, scaleFactor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    let animationFrameId: number;

    if (ctx) {
      const render = (timeStamp: number) => {
        if (timeStamp - lastTimeStampRef.current > 16) {
          ctx.putImageData(
            updatePixels(ctx.getImageData(0, 0, width, height)),
            0,
            0,
          );
          lastTimeStampRef.current = timeStamp;
          animationFrameId = window.requestAnimationFrame(render);
        } else {
          animationFrameId = window.requestAnimationFrame(render);
        }
      };
      render(performance.now());
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [updatePixels, height, width]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
    />
  );
};

export default PixelCanvas;
