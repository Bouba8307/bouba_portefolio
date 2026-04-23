import { useEffect, useState } from "react";

export const useTypewriter = (
  text: string,
  speed: number = 30,
  delayBetweenLoops: number = 45000 // 45 secondes
): string => {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    let i = 0;
    let typingInterval: NodeJS.Timeout;
    let restartTimeout: NodeJS.Timeout;

    const startTyping = () => {
      i = 0;
      setDisplayedText("");

      typingInterval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;

        if (i >= text.length) {
          clearInterval(typingInterval);

          // attendre 45s puis recommencer
          restartTimeout = setTimeout(() => {
            startTyping();
          }, delayBetweenLoops);
        }
      }, speed);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, [text, speed, delayBetweenLoops]);

  return displayedText;
};