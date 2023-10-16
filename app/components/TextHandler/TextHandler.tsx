import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { OverlayDataObj } from "@/app/interfaces/interfaces";

interface TextHandlerProps {
  onNewFireData: (
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
  ) => void;
}

const TextHandler = ({ onNewFireData }: TextHandlerProps) => {
  const [shortMessage, setShortMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onNewFireDataCB = useRef(onNewFireData);

  function onFireMessageClick() {
    if (!canvasRef!.current) return;

    const letterWidth = Math.min(Math.ceil(320 / shortMessage.length), 240); //TODO: Pass in canvas width
    const letterHeight = Math.min(Math.ceil(320 / shortMessage.length), 240); //TODO: make this smarter

    const canvas = canvasRef.current;
    canvas.width = 320; //TODO: Pass in canvas width
    canvas.height = letterHeight;

    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });

    if (ctx) {
      ctx.font = `${letterWidth}px serif`;
      ctx.textAlign = "start";
      ctx.textBaseline = "bottom";
      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(0,0,0,255)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeText(shortMessage, 0, canvas.height, canvas.width);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newFireData = new Uint8ClampedArray(canvas.width * canvas.height);
      let largestX = 0;
      let largestY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (imageData.data[y * canvas.width * 4 + x * 4] !== 0) {
            largestX = Math.max(largestX, x);
            largestY = Math.max(largestY, y);
            newFireData[y * canvas.width + x] = 200;
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
    }
  }

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    setShortMessage(evt.target.value);
  }
  return (
    <div className="flex-col">
      <canvas ref={canvasRef} hidden={true}></canvas>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder=""
        value={shortMessage}
        onChange={onChange}
        required
        maxLength={25}
      ></input>
      <button className="btn btn-primary" onClick={() => onFireMessageClick()}>
        Light it up
      </button>
    </div>
  );
};

export default TextHandler;
