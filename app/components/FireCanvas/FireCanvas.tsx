"use client";
import React, { useEffect, useRef } from "react";

const FireCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if(ctx) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
    }

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="firecanvas" width="320" height="240" />
    </div>
  );
};

export default FireCanvas;
