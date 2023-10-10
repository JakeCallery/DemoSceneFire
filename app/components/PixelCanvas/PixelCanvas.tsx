import React, { useEffect, useRef } from "react";

interface CanvasProps {
  id: string;
  width: number;
  height: number;
  updatePixels: (imageData: ImageData) => ImageData;
}

const PixelCanvas = ({ id, width, height, updatePixels }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    let animationFrameId: number;

    if (ctx) {
      const render = () => {
        ctx.putImageData(
          updatePixels(ctx.getImageData(0, 0, width, height)),
          0,
          0,
        );
        animationFrameId = window.requestAnimationFrame(render);
      };

      render();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [updatePixels, height, width]);

  return <canvas id={id} ref={canvasRef} width={width} height={height} />;
};

export default PixelCanvas;
