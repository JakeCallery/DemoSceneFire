"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const JackOLantern = ({
  width,
  height,
  onNewFireData,
  renderJack,
  onRenderJackCBChange,
}: {
  width: number;
  height: number;
  onNewFireData: (
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
  ) => void;
  renderJack: boolean;
  onRenderJackCBChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [imageLoaded, setImageLoaded] = useState(false);

  const onNewFireDataCB = useRef(onNewFireData);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const lastTimeStampRef = useRef(0);
  const animationFrameIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas?.getContext("2d", { willReadFrequently: true }));
    }

    if (imgRef.current) {
      if (imgRef.current?.complete) setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!renderJack && animationFrameIdRef.current)
      window.cancelAnimationFrame(animationFrameIdRef.current);
  }, [renderJack]);

  useEffect(() => {
    if (!imageLoaded) return;
    if (ctx && imgRef.current && canvasRef.current) {
      ctx.drawImage(
        imgRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    } else {
      console.error("Not Ready when image loaded");
    }
  }, [ctx, imageLoaded]);

  useEffect(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      const render = (timeStamp: number) => {
        if (timeStamp - lastTimeStampRef.current > 15) {
          lastTimeStampRef.current = timeStamp;
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const newFireData = new Uint8ClampedArray(
            canvas.width * canvas.height,
          );
          let largestX = 0;
          let largestY = 0;
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              if (imageData.data[y * canvas.width * 4 + x * 4] !== 0) {
                largestX = Math.max(largestX, x);
                largestY = Math.max(largestY, y);
                newFireData[y * canvas.width + x] = Math.floor(
                  Math.random() * 100 + 100,
                );
              }
            }
          }
          onNewFireDataCB.current(
            newFireData,
            canvas.width,
            canvas.height,
            largestX,
            largestY,
          );
          if (renderJack)
            animationFrameIdRef.current = window.requestAnimationFrame(render);
        } else {
          if (renderJack)
            animationFrameIdRef.current = window.requestAnimationFrame(render);
        }
      };
      if (renderJack) render(performance.now());
    }

    return () => {
      window.cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [ctx, imageLoaded, renderJack]);

  function onImageLoad() {
    setImageLoaded(true);
  }

  function onCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.checked) {
      window.cancelAnimationFrame(animationFrameIdRef.current);
    }
    onRenderJackCBChange(e);
  }

  return (
    <div>
      <input type="checkbox" id="jackolanterncb" onChange={onCheckboxChange} />
      <label htmlFor="jackolanterncb">Jack O&apos; Lantern</label>
      <img
        src="jackolanternline.png"
        alt=""
        width={width / 2}
        height={height / 2}
        onLoad={onImageLoad}
        ref={imgRef}
        hidden={true}
      />
      <canvas
        width={width / 2}
        height={height / 2}
        ref={canvasRef}
        hidden={true}
      />
    </div>
  );
};

export default JackOLantern;
