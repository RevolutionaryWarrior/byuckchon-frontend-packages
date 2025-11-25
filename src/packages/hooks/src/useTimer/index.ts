import { useEffect, useRef, useState } from "react";

type Props = {
  initialMs: number;
  interval?: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

export default function useTimer({
  initialMs,
  interval = 1000,
  onComplete,
  autoStart = false,
}: Props) {
  const [timeSeconds, setTimeSeconds] = useState<number>(
    Math.floor(initialMs / 1000)
  );
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onReset = () => {
    setIsRunning(false);
    setTimeSeconds(Math.floor(initialMs / 1000));
  };

  const setTime = (ms: number) => {
    setTimeSeconds(Math.floor(ms / 1000));
  };

  useEffect(() => {
    if (!isRunning || timeSeconds <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeSeconds((prevState) => {
        if (prevState <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prevState - 1;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeSeconds, onComplete, interval]);

  return {
    timeSeconds,
    isRunning,
    onStart: () => setIsRunning(true),
    onPause: () => setIsRunning(false),
    onReset,
    setTime,
  };
}
