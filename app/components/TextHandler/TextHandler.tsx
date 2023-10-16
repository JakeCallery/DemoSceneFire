import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TextHandlerProps {
  onNewFireData: (
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
  ) => void;
  wordList: string[];
  onNewMessage: (message: string) => void;
  mainCanvasWidth: number;
  mainCanvasHeight: number;
  maxChars: number;
}

const TextHandler = ({
  onNewFireData,
  wordList,
  onNewMessage,
  mainCanvasWidth,
  mainCanvasHeight,
  maxChars,
}: TextHandlerProps) => {
  const [shortMessage, setShortMessage] = useState("");
  const [currentWordList, setCurrentWordList] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onNewFireDataCB = useRef(onNewFireData);
  const wordIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    wordIndexRef.current = 0;
    if (wordIndexRef.current < currentWordList.length) {
      renderWord(currentWordList[wordIndexRef.current]);
      wordIndexRef.current++;
    }

    timerRef.current = setInterval(() => {
      if (wordIndexRef.current < currentWordList.length) {
        renderWord(currentWordList[wordIndexRef.current]);
        wordIndexRef.current++;
      } else {
        clearInterval(timerRef.current);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentWordList]);

  if (currentWordList !== wordList) {
    setCurrentWordList(wordList);
  }

  function renderWord(word: string) {
    if (!canvasRef!.current || !word) return;

    const letterWidth = Math.min(
      Math.ceil(mainCanvasWidth / word.length),
      mainCanvasHeight,
    );
    const letterHeight = Math.min(
      Math.ceil(mainCanvasWidth / word.length),
      mainCanvasHeight,
    );

    const canvas = canvasRef.current;
    canvas.width = mainCanvasWidth;
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
      ctx.strokeText(word, 0, canvas.height, canvas.width);

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

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setShortMessage(e.target.value);
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
        maxLength={maxChars}
      ></input>
      <button
        className="btn btn-primary"
        onClick={() => onNewMessage(shortMessage)}
      >
        Light it up
      </button>
    </div>
  );
};

export default TextHandler;
