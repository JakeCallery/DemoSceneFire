import React, { useEffect, useRef } from "react";

interface CanvasProps {
  id: string;
  width: number;
  height: number;
  updatePixels: (imageData: ImageData) => ImageData;
}

const PixelCanvas = ({ id, width, height, updatePixels }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeStampRef = useRef(0);

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
      className="w-full h-full"
    />
  );
};

export default PixelCanvas;
