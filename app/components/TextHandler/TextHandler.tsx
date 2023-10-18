import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TextHandlerProps {
  onNewFireData: (
    data: Uint8ClampedArray,
    dataWidth: number,
    dataHeight: number,
    contentWidth: number,
    contentHeight: number,
    source: string,
  ) => void;
  wordList: string[];
  onNewMessage: (message: string) => void;
  mainCanvasWidth: number;
  mainCanvasHeight: number;
  maxChars: number;
  onMessageStart: () => void;
  onMessageStop: () => void;
}

const TextHandler = ({
  onNewFireData,
  wordList,
  onNewMessage,
  mainCanvasWidth,
  mainCanvasHeight,
  maxChars,
  onMessageStart,
  onMessageStop,
}: TextHandlerProps) => {
  const [shortMessage, setShortMessage] = useState("");
  const [currentWordList, setCurrentWordList] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onNewFireDataCB = useRef(onNewFireData);
  const wordIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    wordIndexRef.current = 0;
    onMessageStart();

    timerRef.current = setInterval(() => {
      if (wordIndexRef.current < currentWordList.length) {
        renderWord(currentWordList[wordIndexRef.current]);
        wordIndexRef.current++;
      } else {
        clearInterval(timerRef.current);
        onMessageStop();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentWordList]);

  if (
    currentWordList !== wordList &&
    wordList.length > 0 &&
    wordList[0] !== ""
  ) {
    setCurrentWordList(wordList);
    setShortMessage(wordList.join(" "));
  }

  function renderWord(word: string) {
    if (!canvasRef.current || !word) return;
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
        "text",
      );
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setShortMessage(e.target.value);
  }
  return (
    <>
      <canvas ref={canvasRef} hidden={true}></canvas>
      <div className="flex-row w-full md:space-x-2">
        <input
          type="text"
          id="first_name"
          className="align-middle input input-bordered input-secondary w-full md:w-64"
          placeholder="Text to set a blaze"
          value={shortMessage}
          onChange={onChange}
          required
          maxLength={maxChars}
          onKeyDown={(e) => e.key === "Enter" && onNewMessage(shortMessage)}
        ></input>
        <button
          className="btn btn-primary align-middle w-full mt-2 md:mt-0 md:w-64"
          onClick={() => onNewMessage(shortMessage)}
        >
          Send message to fire
        </button>
      </div>
    </>
  );
};

export default TextHandler;
