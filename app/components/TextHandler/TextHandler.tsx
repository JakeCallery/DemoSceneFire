import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TextHandlerProps {
  onNewFireData: (data: Uint8ClampedArray) => void;
  textWidth: number;
  textHeight: number;
}

const TextHandler = ({
  onNewFireData,
  textWidth,
  textHeight,
}: TextHandlerProps) => {
  const [currentChar, setCurrentChar] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onNewFireDataCB = useRef(onNewFireData);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (canvas && ctx) {
      ctx.font = "48px serif";
      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(0,0,0,255)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeText(currentChar, 0, 45);

      const imageData = ctx.getImageData(0, 0, textWidth, textHeight);
      const newFireData = new Uint8ClampedArray(textWidth * textHeight);
      for (let y = 0; y < textHeight; y++) {
        for (let x = 0; x < textWidth; x++) {
          if (imageData.data[y * textWidth * 4 + x * 4] !== 0) {
            newFireData[y * textWidth + x] = 200;
          }
        }
      }
      onNewFireDataCB.current(newFireData);
    }
  }, [currentChar, textHeight, textWidth]);

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    setCurrentChar(evt.target.value.slice(-1));
  }
  return (
    <div className="flex-col">
      <canvas width="50" height="50" ref={canvasRef}></canvas>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder=""
        value={currentChar}
        onChange={onChange}
        required
      ></input>
    </div>
  );
};

export default TextHandler;
